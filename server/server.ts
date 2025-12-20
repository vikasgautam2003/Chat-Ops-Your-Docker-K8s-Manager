// import express from 'express';
// import cors from 'cors';
// import { createServer } from 'http';
// import WebSocket, { WebSocketServer } from 'ws';
// import { Queue, Worker, QueueEvents } from 'bullmq';
// import IORedis from 'ioredis';
// import dotenv from 'dotenv';
// import { DockerService } from './src/docker';

// dotenv.config();


// const app = express();
// app.use(cors({ origin: "*" }));
// app.use(express.json());


// const connectionString = process.env.REDIS_URL;


// if (!connectionString) {
//     throw new Error("❌ REDIS_URL is missing in .env file");
// }


// const redisConnection = new IORedis(connectionString, {
//     maxRetriesPerRequest: null,
// });


// const dockerQueue = new Queue('docker-ops', {connection: redisConnection});
// const dockerQueueEvents = new QueueEvents('docker-ops', {connection: redisConnection});

// const server = createServer(app);

// const wss: WebSocketServer = new WebSocketServer({ server: server });

// const broadcastLog = (msg: string) => {
//     const timestamp = new Date().toLocaleTimeString();
//     const logMessage = `\r\n\x1b[36m[${timestamp}]\x1b[0m ${msg}`;
//     wss.clients.forEach((client : WebSocket) => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(logMessage);
//         }
//     });
// };



// wss.on('connection', (ws) => {
//     ws.send('\r\n\x1b[32m✔ Connected to Cloud Command Center (Upstash-Powered).\x1b[0m\r\n');
// });


// const dockerService = new DockerService();


// const worker = new Worker(
//     'docker-ops',
//     async (job) => {
//         broadcastLog(`Received Job ${job.id}: \x1b[33m${job.name}\x1b[0m`);
//         try {
//             let result;
//             switch (job.name) {
//                 case 'list_containers':
//                     broadcastLog("  > Connecting to Docker Daemon...");
//                     await new Promise(r => setTimeout(r, 800));
//                     result = await dockerService.listContainers();
//                     broadcastLog(`  > Success: Retrieved ${result.length} containers.`);
//                     break;
//                 default:
//                     throw new Error(`Unknown job type: ${job.name}`);
//             }
//             broadcastLog(`✔ Job ${job.id} Completed.\r\n`);
//             return result;
//         } catch (err: any) {
//             broadcastLog(`❌ Job Failed: ${err.message}`);
//             throw err;
//         }
//     },
//     { connection: redisConnection }
// );



// app.post("/tools/list_containers", async (req, res) => {
//     try {
//         broadcastLog("⚡ Request received from AI Agent...");
//         const job = await dockerQueue.add('list_containers', {});
//         const result = await job.waitUntilFinished(dockerQueueEvents);
//         res.json({ result });
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ error: "Job Failed" });
//     }
// });

// const PORT = 3001;
// server.listen(PORT, () => {
//     console.log(`🚀 Server Online. Connected to Upstash.`);
// });











import express from "express";
import cors from "cors";
import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { Queue, Worker, QueueEvents, Job } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";
import toolRoutes from "./routes/toolRoutes";
import { DockerService } from "./src/docker";

dotenv.config();

/* --------------------------------------------------
   ENV & REDIS
-------------------------------------------------- */

const workerConnection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false, 
});

/* --------------------------------------------------
   EXPRESS APP
-------------------------------------------------- */

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ strict: false }));
app.use("/tools", toolRoutes);

/* --------------------------------------------------
   HTTP + WEBSOCKET SERVER
-------------------------------------------------- */
console.log("REDIS_URL =", process.env.REDIS_URL);


const server = createServer(app);
const wss = new WebSocketServer({ server });

const broadcastLog = (msg: string) => {
  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `\r\n\x1b[36m[${timestamp}]\x1b[0m ${msg}`;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(logMessage);
    }
  });
};

wss.on("connection", (ws) => {
  ws.send(
    "\r\n\x1b[32m✔ Connected to Cloud Command Center (Upstash-Powered).\x1b[0m\r\n"
  );
});

/* --------------------------------------------------
   BULLMQ QUEUE
-------------------------------------------------- */


/* --------------------------------------------------
   WORKER
-------------------------------------------------- */

const dockerService = new DockerService();

const worker = new Worker(
  "docker-ops",
  async (job: Job) => {
    broadcastLog(`Received Job ${job.id}: \x1b[33m${job.name}\x1b[0m`);

    try {
      const data = job.data ?? {};
      const containerId =
        typeof data.containerId === "string"
          ? data.containerId.trim()
          : null;

      switch (job.name) {
        case "list_containers": {
          broadcastLog("  > Connecting to Docker Daemon...");
          await new Promise((r) => setTimeout(r, 800));

          const result = await dockerService.listContainers();

          broadcastLog(
            `  > Success: Retrieved ${result.length} containers.`
          );

          return result;
        }

        case "start_container": {
          validateContainerId(containerId);
          broadcastLog(`  > 🟢 Starting container: ${containerId}...`);

          const result = await dockerService.startContainer(containerId!);

          broadcastLog("  > ✔ Container started.");
          return result;
        }

        case "stop_container": {
          validateContainerId(containerId);
          broadcastLog(`  > 🛑 Stopping container: ${containerId}...`);

          const result = await dockerService.stopContainer(containerId!);

          broadcastLog("  > ✔ Container stopped.");
          return result;
        }

        case "search_images": {
          const { term } = data;

          if (!term || typeof term !== "string") {
            throw new Error("Invalid search term");
          }

          broadcastLog(`  > 🔍 Searching Docker Hub for: ${term}...`);

          const result = await dockerService.searchImages(term);

          broadcastLog(
            `  > ✔ Found ${result.length} images for '${term}'.`
          );

          return result;
        }

        case "pull_image": {
          const { imageName } = data;

          if (!imageName || typeof imageName !== "string") {
            throw new Error("Invalid image name");
          }

          broadcastLog(`  > ⬇️ Pulling image: ${imageName}...`);

          const result = await dockerService.pullImage(imageName);

          broadcastLog(`  > ✔ Image pulled: ${imageName}`);
          return result;
        }

        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
    } catch (err: any) {
      broadcastLog(`❌ Job Failed: ${err.message}`);
      throw err;
    }
  },
  { connection: workerConnection }
);

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

function validateContainerId(containerId: string | null): void {
  if (!containerId || containerId === "container_id_value") {
    throw new Error("Invalid containerId provided");
  }

  if (!/^[a-f0-9]{12,64}$/i.test(containerId)) {
    throw new Error(`Invalid containerId format: ${containerId}`);
  }
}

/* --------------------------------------------------
   START SERVER
-------------------------------------------------- */

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server Online. Connected to Upstash.`);
});
