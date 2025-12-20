import { Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.REDIS_URL;
if (!connectionString) throw new Error("REDIS_URL missing");

const createConnection = () => {
  return new IORedis(connectionString, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
};

export const dockerQueue = new Queue("docker-ops", {
  connection: createConnection(),
});

export const dockerQueueEvents = new QueueEvents("docker-ops", {
  connection: createConnection(),
});

export const broadcastLog = (msg: string) => {
  console.log(`[LOG] ${msg}`);
};
