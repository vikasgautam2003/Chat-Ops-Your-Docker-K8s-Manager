// import express from 'express';
// import cors from 'cors';
// import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
// import { DockerService } from './docker';

// const app = express();
// app.use(cors({
//   origin: "http://localhost:3000", // Only allow your Frontend
//   methods: ["GET", "POST", "OPTIONS"], // Allow these actions
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true // Crucial for some stream types
// }));

// const dockerService = new DockerService();
// const server = new McpServer({ name: "srank-server", version: "1.0.0" });

// server.tool("list_containers", {}, async () => {
//   const containers = await dockerService.listContainers();
//   return {
//     content: [{ type: "text", text: JSON.stringify(containers) }]
//   };
// });

// let transport: SSEServerTransport | null = null;

// app.get('/sse', async (req, res) => {
//   transport = new SSEServerTransport("/messages", res);
//   await server.connect(transport);
// });

// app.post('/messages', async (req, res) => {
//   if (transport) {
//     await transport.handlePostMessage(req, res);
//   } else {
//     res.status(404).json({ error: "No active connection" });
//   }
// });

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });










import express, { Request, Response } from 'express';
import cors from 'cors';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { DockerService } from './docker';

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

const dockerService = new DockerService();
const server = new McpServer({ name: "srank-server", version: "1.0.0" });

server.tool("list_containers", {}, async () => {
  console.log("🛠️ Tool called: list_containers");
  const containers = await dockerService.listContainers();
  return {
    content: [{ type: "text", text: JSON.stringify(containers) }]
  };
});

let transport: SSEServerTransport | null = null;

app.get('/sse', async (req: Request, res: Response) => {
  console.log("🔌 New Connection Request from Browser");
  
  // FIX: Use Absolute URL so the browser knows to hit port 3001, not 3000
  transport = new SSEServerTransport("/messages", res);

  
  await server.connect(transport);
});

app.post('/messages', async (req: Request, res: Response) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(404).json({ error: "No active connection" });
  }
});



app.post("/tools/list_containers", async (req, res) => {
  try {
    const containers = await dockerService.listContainers();
    res.json({ result: containers });
  } catch (e) {
    res.status(500).json({ error: "Failed to list containers" });
  }
});




const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});