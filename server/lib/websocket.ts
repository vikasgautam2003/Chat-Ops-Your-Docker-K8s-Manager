import WebSocket, { WebSocketServer } from "ws";

let wss: WebSocketServer | null = null;

export const initWebSocket = (server: any) => {
  wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    ws.send("\r\n\x1b[32m✔ Connected to Distributed Command Center.\x1b[0m\r\n");
  });
};

export const broadcastLog = (msg: string) => {
  console.log(`[LOG] ${msg}`); 

  if (!wss) return;

  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `\r\n\x1b[36m[${timestamp}]\x1b[0m ${msg}`;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(logMessage);
    }
  });
};