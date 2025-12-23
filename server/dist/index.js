"use strict";
// import express from 'express';
// import cors from 'cors';
// import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
// import { DockerService } from './docker';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const docker_1 = require("./docker");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
const dockerService = new docker_1.DockerService();
const server = new mcp_js_1.McpServer({ name: "srank-server", version: "1.0.0" });
server.tool("list_containers", {}, async () => {
    console.log("🛠️ Tool called: list_containers");
    const containers = await dockerService.listContainers();
    return {
        content: [{ type: "text", text: JSON.stringify(containers) }]
    };
});
let transport = null;
app.get('/sse', async (req, res) => {
    console.log("🔌 New Connection Request from Browser");
    // FIX: Use Absolute URL so the browser knows to hit port 3001, not 3000
    transport = new sse_js_1.SSEServerTransport("/messages", res);
    await server.connect(transport);
});
app.post('/messages', async (req, res) => {
    if (transport) {
        await transport.handlePostMessage(req, res);
    }
    else {
        res.status(404).json({ error: "No active connection" });
    }
});
app.post("/tools/list_containers", async (req, res) => {
    try {
        const containers = await dockerService.listContainers();
        res.json({ result: containers });
    }
    catch (e) {
        res.status(500).json({ error: "Failed to list containers" });
    }
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
