







import express from "express";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import toolRoutes from "./routes/toolRoutes";
import { initWebSocket } from "./lib/websocket";


import "./lib/dockerWorker";
import "./lib/codeWorker";
import "./lib/k8sWorker";


dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const server = createServer(app);


initWebSocket(server);


app.use("/tools", toolRoutes);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Distributed System Online on port ${PORT}`);
  console.log(`   - Worker 1: Docker Ops (Active)`);
  console.log(`   - Worker 2: Code Gen (Active)`);
});