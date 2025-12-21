// import { Queue, QueueEvents } from "bullmq";
// import IORedis from "ioredis";
// import dotenv from "dotenv";

// dotenv.config();

// const connectionString = process.env.REDIS_URL;
// if (!connectionString) throw new Error("REDIS_URL missing");

// const createConnection = () => {
//   return new IORedis(connectionString, {
//     maxRetriesPerRequest: null,
//     enableReadyCheck: false,
//   });
// };

// export const dockerQueue = new Queue("docker-ops", {
//   connection: createConnection(),
// });

// export const dockerQueueEvents = new QueueEvents("docker-ops", {
//   connection: createConnection(),
// });

// export const broadcastLog = (msg: string) => {
//   console.log(`[LOG] ${msg}`);
// };






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

// 1. DOCKER OPS QUEUE (Existing)
export const dockerQueue = new Queue("docker-ops", { connection: createConnection() });
export const dockerQueueEvents = new QueueEvents("docker-ops", { connection: createConnection() });

// 2. CODE GEN QUEUE (New)
export const codeQueue = new Queue("code-gen", { connection: createConnection() });
export const codeQueueEvents = new QueueEvents("code-gen", { connection: createConnection() });

// Export shared broadcaster for backward compatibility if needed
export { broadcastLog } from "./lib/websocket";