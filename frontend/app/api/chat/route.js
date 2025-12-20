

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});




const SYSTEM_PROMPT = `
You are a backend automation agent.

Rules:
- You may call tools only using the provided JSON schema.
- Tool calls must be valid JSON only.
- Do NOT use XML, markdown, or natural language when calling tools.
- Do NOT explain tool calls.

Container safety rules:
- NEVER invent a container ID.
- NEVER use placeholder values such as "container_id_value".
- You may call start_container or stop_container ONLY if a real container ID
  (12+ hex characters) appears explicitly in the conversation history
  from a list_containers result.
- If no valid container ID is known, DO NOT call any tool.
  Instead, respond in plain text asking the user to select a container
  from the list_containers output.
`;



const DOCKER_TOOLS = [
  {
    type: "function",
    function: {
      name: "list_containers",
      description:
        "List all running and stopped Docker containers to see their IDs, names, and status",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "stop_container",
      description: "Stop a running docker container using its ID",
      parameters: {
        type: "object",
        properties: {
          containerId: { type: "string" },
        },
        required: ["containerId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "start_container",
      description: "Start a stopped docker container using its ID",
      parameters: {
        type: "object",
        properties: {
          containerId: { type: "string" },
        },
        required: ["containerId"],
      },
    },
  },
];

export async function POST(req) {
  try {
    const body = await req.json();
    const history = Array.isArray(body.history) ? body.history : [];
    const message =
      typeof body.message === "string" ? body.message : "";

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history
        .map((h) => ({
          role: h.role === "model" ? "assistant" : "user",
          content: h.parts?.[0]?.text ?? "",
        }))
        .filter((m) => m.content.trim().length > 0),
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      tools: DOCKER_TOOLS,
      tool_choice: "auto",
    });

    const choice = completion.choices[0];

    if (
      choice.finish_reason === "tool_calls" &&
      choice.message.tool_calls?.length
    ) {
      const toolCall = choice.message.tool_calls[0];

      let args = {};
      try {
        args = JSON.parse(toolCall.function.arguments ?? "{}");
      } catch {
        args = {};
      }

      const toolName = toolCall.function.name;
const containerId = args?.containerId;

        if (
          (toolName === "start_container" || toolName === "stop_container") &&
          (!containerId || containerId === "container_id_value")
        ) {
          return Response.json({
            role: "model",
            text:
              "I don’t have a valid container ID yet. " +
              "Please run **list containers** and select a container ID.",
          });
        }


      return Response.json({
        role: "model",
        toolRequest: {
          name: toolCall.function.name,
          args,
        },
      });
    }

    return Response.json({
      role: "model",
      text: choice.message.content ?? "",
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
