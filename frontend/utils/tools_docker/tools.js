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