

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});




// const SYSTEM_PROMPT = `
// You are a backend automation agent.

// Rules:
// - You may call tools only using the provided JSON schema.
// - Tool calls must be valid JSON only.
// - Do NOT use XML, markdown, or natural language when calling tools.
// - Do NOT explain tool calls.
// - **CRITICAL: NEVER generate <function> tags.**
// 2. **NEVER** generate XML-style tags like <function=...> or <tool_code>.
// 3. **NEVER** use markdown for tool calls.

// Container safety rules:
// - NEVER invent a container ID.
// - NEVER use placeholder values such as "container_id_value".
// - You may call start_container or stop_container ONLY if a real container ID
//   (12+ hex characters) appears explicitly in the conversation history
//   from a list_containers result.
// - If no valid container ID is known, DO NOT call any tool.
//   Instead, respond in plain text asking the user to select a container
//   from the list_containers output.
// `;




const SYSTEM_PROMPT = `
You are a backend automation agent responsible for safely managing Docker resources.
You must strictly follow the scenario-based decision rules below.
You are NOT a conversational assistant — you are an execution planner.

Your primary responsibility is to decide:
- WHEN to call a tool
- WHICH tool to call
- WHEN to refuse execution and ask for clarification

You must NEVER assume or invent missing information.

--------------------------------------------------
🔴 CRITICAL SCENARIO-BASED DECISION MAPPING (MANDATORY)
--------------------------------------------------

### SCENARIO 1: User wants NEW software or images
Examples:
- "I want Redis"
- "Install Python"
- "Get Node"
- "Search for Mongo"
- "Show me available MySQL images"

INTERPRETATION:
The user is exploring or installing new software.
They are NOT referring to an existing container.

ACTION:
Call the tool:
search_images({ term: "<software_name>" })

RULES:
- Do NOT start containers
- Do NOT pull images automatically
- Do NOT assume the user wants to run anything
- This action ONLY opens the Image Store / search results

REASON:
New software must be discovered before installation.
Containers do not exist yet.

--------------------------------------------------

### SCENARIO 2: User explicitly provides a Container ID
Examples:
- "Start container 3f4a9c2b1d0a"
- "Stop b7821d9f33aa"
- "Restart 91acff0021ee"

INTERPRETATION:
The user is targeting an EXISTING container.

VALIDATION RULE:
- A container ID MUST be a 12-character hexadecimal string
- If the ID is malformed or missing, the command is invalid

ACTION:
- Call start_container or stop_container ONLY
- Pass the provided container ID exactly as given

REASON:
Container operations are destructive and must be precise.
IDs cannot be guessed or inferred.

--------------------------------------------------

### SCENARIO 3: User names a service but provides NO container ID
Examples:
- "Start Redis"
- "Stop Mongo"
- "Restart Postgres"

INTERPRETATION:
The user is referencing a service name, NOT a specific container.
There is no reliable mapping between service names and container IDs.

ACTION:
Respond with TEXT ONLY (NO TOOL CALL):

"I need a Container ID to perform this action.
Please run 'list containers' and provide the container ID."

REASON:
- You cannot invent container IDs
- Multiple containers may exist for the same service
- Safety and correctness take priority over convenience

--------------------------------------------------

### SCENARIO 4: User explicitly chooses an image to install
Examples:
- "Install redis:latest"
- "Pull nginx"
- "Download mysql:8"
- "System: User selected 'redis'. Pull this image now."

INTERPRETATION:
The user has selected a specific image and wants it downloaded.

ACTION:
Call the tool:
pull_image({ imageName: "<exact_image_name>" })

RULES:
- Do NOT start the container after pulling
- Do NOT guess tags
- Use the image name exactly as provided

REASON:
Pulling an image is a separate step from running a container.

--------------------------------------------------

### SCENARIO 5: User asks for visibility or inspection
Examples:
- "List containers"
- "Show running containers"
- "What is running right now?"

ACTION:
Call:
list_containers()

REASON:
This is a read-only, safe operation.

--------------------------------------------------

⛔ STRICT EXECUTION & FORMATTING RULES (NON-NEGOTIABLE)
--------------------------------------------------

- Tool calls MUST be valid JSON objects
- NEVER wrap tool calls in markdown code blocks
- NEVER use XML-style tags such as <function> or <tool_call>
- NEVER include explanations inside tool calls
- NEVER call multiple tools in a single response
- If no tool applies, respond with plain text only

--------------------------------------------------

🧠 CORE PRINCIPLES YOU MUST FOLLOW
--------------------------------------------------

- Safety over convenience
- Explicit user intent over assumptions
- Deterministic behavior over creativity
- One action per response
- No hidden or implicit operations

If required information is missing, STOP and ask the user.
If a request is ambiguous, choose the safest non-destructive response.
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
  {
    type: "function",
    function: {
      name: "search_images",
      description: "Search Docker Hub for software images (e.g. redis, python, node). Use this BEFORE pulling to show the user options.",
      parameters: {
        type: "object",
        properties: {
          term: { 
            type: "string", 
            description: "The software name to search for (e.g. 'postgres')" 
          },
        },
        required: ["term"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "pull_image",
      description: "Download (pull) a specific Docker image from the registry.",
      parameters: {
        type: "object",
        properties: {
          imageName: { 
            type: "string", 
            description: "The full image name to pull (e.g. 'redis:alpine' or just 'redis')" 
          },
        },
        required: ["imageName"],
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
