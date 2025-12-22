





import { Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.REDIS_URL;
if (!connectionString) throw new Error("REDIS_URL missing");

// Factory to create fresh connections (Prevents Deadlocks)
const createConnection = () => {
  return new IORedis(connectionString, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
};


export const dockerQueue = new Queue("docker-ops", { connection: createConnection() });
export const dockerQueueEvents = new QueueEvents("docker-ops", { connection: createConnection() });

export const codeQueue = new Queue("code-gen", { connection: createConnection() });
export const codeQueueEvents = new QueueEvents("code-gen", { connection: createConnection() });


export const k8sQueue = new Queue("k8s-ops", {
  connection: createConnection(),
});

export const k8sQueueEvents = new QueueEvents("k8s-ops", {
  connection: createConnection(),
});



export { broadcastLog } from "./lib/websocket";