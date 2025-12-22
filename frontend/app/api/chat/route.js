






import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// const SYSTEM_PROMPT = `
// You are a backend automation agent responsible for safely managing Docker resources and LOCAL Kubernetes resources.

// You must strictly follow the scenario-based decision rules below.
// You are NOT a conversational assistant — you are an execution planner.

// Your primary responsibility is to decide:
// - WHEN to call a tool
// - WHICH tool to call
// - WHEN to refuse execution and ask for clarification

// You must NEVER assume or invent missing information.

// --------------------------------------------------
// 🔴 CRITICAL SCENARIO-BASED DECISION MAPPING (MANDATORY)
// --------------------------------------------------

// ### SCENARIO 1: User wants NEW software or images
// ACTION:
// Call:
// search_images({ term: "<software_name>" })

// --------------------------------------------------

// ### SCENARIO 2: User explicitly provides a Container ID
// ACTION:
// Call start_container or stop_container ONLY.

// --------------------------------------------------

// ### SCENARIO 3: User names a service but provides NO container ID
// ACTION:
// Respond with TEXT ONLY asking for container ID.

// --------------------------------------------------

// ### SCENARIO 4: User explicitly chooses an image to install
// ACTION:
// Call:
// pull_image({ imageName: "<exact_image_name>" })

// --------------------------------------------------

// ### SCENARIO 5: User asks for visibility
// ACTION:
// Call:
// list_containers()

// --------------------------------------------------

// ### 5. CODE GENERATION (Dockerfile)
// **Trigger:** User asks to "generate", "create", "make", or "write" a Dockerfile.

// ✅ **CORRECT ACTION:**
// Call: generate_dockerfile({ language: "language_name" })

// **Examples:**
// - "Generate a Dockerfile for Node.js" -> generate_dockerfile({ "language": "node" })
// - "Create a python dockerfile" -> generate_dockerfile({ "language": "python" })
// - "Make a dockerfile for go" -> generate_dockerfile({ "language": "go" })
// -------------------------------------------------

// ### 6. KUBERNETES GENERATION
// **Trigger:** User asks for "k8s files", "deployment yaml", "manifests", or "deploy to kubernetes".

// ✅ **CORRECT ACTION:**
// Call: generate_k8s_manifest({ imageName: "name", port: "3002" })

// **Examples:**
// - "Create k8s files for nginx" -> generate_k8s_manifest({ "imageName": "nginx", "port": "80" })
// - "Deploy my-node-app to kubernetes" -> generate_k8s_manifest({ "imageName": "my-node-app", "port": "3002" })
// ------------------------------------------------

// ⛔ STRICT RULES
// --------------------------------------------------
// - NEVER invent IDs
// - NEVER guess
// - One action per response
// `;




const SYSTEM_PROMPT = `
You are a backend automation agent responsible for safely managing
LOCAL Docker resources and LOCAL Kubernetes resources.

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
ACTION:
Call:
search_images({ term: "<software_name>" })

--------------------------------------------------

### SCENARIO 2: User explicitly provides a Container ID
ACTION:
Call start_container or stop_container ONLY.

--------------------------------------------------

### SCENARIO 3: User names a service but provides NO container ID
ACTION:
Respond with TEXT ONLY asking for container ID.

--------------------------------------------------

### SCENARIO 4: User explicitly chooses an image to install
ACTION:
Call:
pull_image({ imageName: "<exact_image_name>" })

--------------------------------------------------

### SCENARIO 5: User asks for Docker visibility
ACTION:
Call:
list_containers()

--------------------------------------------------

### SCENARIO 6: CODE GENERATION (Dockerfile)
Trigger:
User asks to "generate", "create", "make", or "write" a Dockerfile.

CORRECT ACTION:
Call:
generate_dockerfile({ language: "language_name" })

Examples:
- "Generate a Dockerfile for Node.js"
- "Create a python dockerfile"
- "Make a dockerfile for go"

--------------------------------------------------

### SCENARIO 7: KUBERNETES FILE GENERATION (YAML ONLY)
Trigger:
User asks for "k8s files", "deployment yaml", "manifests",
or "deploy to kubernetes" (file generation only).

CORRECT ACTION:
Call:
generate_k8s_manifest({ imageName: "name", port: "3002" })

Examples:
- "Create k8s files for nginx"
- "Deploy my-node-app to kubernetes"

--------------------------------------------------

### SCENARIO 8: KUBERNETES VISIBILITY (READ-ONLY, LOCAL)
Trigger:
User asks about Kubernetes, k8s, cluster status, pods,
services, deployments, or what is running in Kubernetes.

CORRECT ACTIONS (READ-ONLY ONLY):
- k8s_get_pods
- k8s_get_services
- k8s_get_deployments
- k8s_cluster_info

STRICT RULES FOR KUBERNETES:
- LOCAL cluster only (Docker Desktop / Minikube / Kind)
- Default namespace only
- READ-ONLY access
- NEVER create, delete, scale, or modify resources
- NEVER expose kubectl syntax
- NEVER guess cluster state

--------------------------------------------------

⛔ GLOBAL STRICT RULES
--------------------------------------------------
- NEVER invent IDs
- NEVER guess
- One action per response
`;






const DOCKER_TOOLS = [
  {
    type: "function",
    function: {
      name: "list_containers",
      description: "List all containers",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "start_container",
      description: "Start a container by ID",
      parameters: {
        type: "object",
        properties: { containerId: { type: "string" } },
        required: ["containerId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "stop_container",
      description: "Stop a container by ID",
      parameters: {
        type: "object",
        properties: { containerId: { type: "string" } },
        required: ["containerId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_images",
      description: "Search Docker Hub",
      parameters: {
        type: "object",
        properties: { term: { type: "string" } },
        required: ["term"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "pull_image",
      description: "Pull a docker image",
      parameters: {
        type: "object",
        properties: { imageName: { type: "string" } },
        required: ["imageName"],
      },
    },
  },
   {
    type: "function",
    function: {
      name: "generate_dockerfile",
      description: "Generate a production-ready Dockerfile for a specific programming language.",
      parameters: {
        type: "object",
        properties: {
          language: { 
            type: "string", 
            description: "The programming language (e.g. node, python, go, nextJs, reactJs)" 
          },
        },
        required: ["language"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_k8s_manifest",
      description: "Generate Kubernetes deployment and service YAML files for a specific image.",
      parameters: {
        type: "object",
        properties: {
          imageName: { 
            type: "string", 
            description: "The image name (e.g. nginx, my-app, redis:alpine)" 
          },
          port: { 
            type: "string", 
            description: "The container port (default: 3000)" 
          },
        },
        required: ["imageName"],
      },
    },
  },
  {
  type: "function",
  function: {
    name: "k8s_get_pods",
    description: "List all Kubernetes pods in the default namespace",
    parameters: {
      type: "object",
      properties: {},
    },
  },
},
{
  type: "function",
  function: {
    name: "k8s_get_services",
    description: "List all Kubernetes services in the default namespace",
    parameters: {
      type: "object",
      properties: {},
    },
  },
},
{
  type: "function",
  function: {
    name: "k8s_get_deployments",
    description: "List all Kubernetes deployments in the default namespace",
    parameters: {
      type: "object",
      properties: {},
    },
  },
},
{
  type: "function",
  function: {
    name: "k8s_cluster_info",
    description: "Get local Kubernetes cluster status",
    parameters: {
      type: "object",
      properties: {},
    },
  },
},

];

function routeIntent(text) {
  const lower = text.toLowerCase();

  if (
  lower.includes("kubernetes") ||
  lower.includes("k8s") ||
  lower.includes("cluster") ||
  lower.includes("pods") ||
  lower.includes("services") ||
  lower.includes("deployments")
) {
  if (lower.includes("service")) {
    return { name: "k8s_get_services", args: {} };
  }

  if (lower.includes("deployment")) {
    return { name: "k8s_get_deployments", args: {} };
  }

  if (lower.includes("cluster")) {
    return { name: "k8s_cluster_info", args: {} };
  }

  return { name: "k8s_get_pods", args: {} };
}


  // 1. Pull Logic (System or User)
  if (/pull this image now/.test(lower)) {
    const match = text.match(/'([^']+)'/);
    if (match) {
      return { name: "pull_image", args: { imageName: match[1] } };
    }
  }

  // 2. List Logic
  if (/list|show.*containers/.test(lower)) {
    return { name: "list_containers", args: {} };
  }

  // 3. Start/Stop Logic (FIXED REGEX)
  if (/^(start|stop)\s+/i.test(lower)) {
    // FIX: Changed from {12,64} to {5,64} to support short IDs
    const idMatch = text.match(/\b[a-f0-9]{5,64}\b/i);
    if (idMatch) {
      return {
        name: lower.startsWith("stop") ? "stop_container" : "start_container",
        args: { containerId: idMatch[0] },
      };
    }
    // If regex fails, return null so LLM can handle it
    return null;
  }

  // 4. Search Logic
  if (/install|get|search|show.*images/.test(lower)) {
    const match = lower.match(/redis|mongo|mysql|postgres|nginx|node|python/);
    if (match) {
      return { name: "search_images", args: { term: match[0] } };
    }
  }

  // 5. Explicit Pull Logic
  if (/pull|download/.test(lower)) {
    const match = text.match(/([\w-]+(:[\w.-]+)?)/);
    if (match) {
      return { name: "pull_image", args: { imageName: match[1] } };
    }
  }

  return null;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const history = Array.isArray(body.history) ? body.history : [];
    const message = typeof body.message === "string" ? body.message : "";

    // 1. Handle System Messages from Frontend
    if (message.startsWith("System: User selected")) {
      const match = message.match(/'([^']+)'/);
      if (match) {
        return Response.json({
          role: "model",
          toolRequest: {
            name: "pull_image",
            args: { imageName: match[1] },
          },
        });
      }
    }

    // 2. Try Regex Routing first (Fast Path)
    const directIntent = routeIntent(message);
    if (directIntent) {
      return Response.json({
        role: "model",
        toolRequest: directIntent,
      });
    }

    // 3. Fallback to LLM (Slow Path)
    // We enable tool_choice: "auto" so the AI can catch what the regex missed
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((h) => ({
        role: h.role === "model" ? "assistant" : "user",
        content: h.parts?.[0]?.text ?? "",
      })),
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      tools: DOCKER_TOOLS, // FIX: Pass tools so AI can use them if regex fails
      tool_choice: "auto", // FIX: Allow AI to decide instead of forcing "none"
    });

    const choice = completion.choices[0];

    // Check if AI wants to call a tool
    if (choice.finish_reason === "tool_calls" && choice.message.tool_calls?.length) {
       const toolCall = choice.message.tool_calls[0];
       return Response.json({
          role: "model",
          toolRequest: {
             name: toolCall.function.name,
             args: JSON.parse(toolCall.function.arguments || "{}")
          }
       });
    }

    // Otherwise return text
    return Response.json({
      role: "model",
      text: choice.message.content ?? "",
    });

  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}