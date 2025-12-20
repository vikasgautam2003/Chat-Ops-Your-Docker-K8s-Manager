

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT =
  "You are a backend automation agent. When a tool is required, you must call it using the provided function schema only. Tool calls must be valid JSON. Do not use XML, tags, markdown, or natural language when calling a tool. Do not explain tool calls.";

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
