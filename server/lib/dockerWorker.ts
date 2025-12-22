import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { DockerService } from "../src/docker";
import { broadcastLog } from "../lib/websocket";



const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const dockerService = new DockerService();




function validateContainerId(containerId: string | null): void {
  if (!containerId || containerId === "container_id_value") {
    throw new Error("Invalid containerId provided");
  }
  if (!/^[a-f0-9]{5,64}$/i.test(containerId)) {
    throw new Error(`Invalid containerId format: ${containerId}`);
  }
}

export const dockerWorker = new Worker(
  "docker-ops",
  async (job: Job) => {
    broadcastLog(`🐳 Docker Worker processing: ${job.name}`);
    const data = job.data ?? {};

    try {
      const containerId = typeof data.containerId === "string" ? data.containerId.trim() : null;

      switch (job.name) {
        case "list_containers":
          broadcastLog("  > Connecting to Docker Daemon...");
          const containers = await dockerService.listContainers();
          broadcastLog(`  > Success: Retrieved ${containers.length} containers.`);
          return containers;

        case "start_container":
          validateContainerId(containerId);
          broadcastLog(`  > 🟢 Starting container: ${containerId}...`);
          const startRes = await dockerService.startContainer(containerId!);
          broadcastLog("  > ✔ Container started.");
          return startRes;

        case "stop_container":
          validateContainerId(containerId);
          broadcastLog(`  > 🛑 Stopping container: ${containerId}...`);
          const stopRes = await dockerService.stopContainer(containerId!);
          broadcastLog("  > ✔ Container stopped.");
          return stopRes;

        case "search_images":
          if (!data.term) throw new Error("Invalid search term");
          broadcastLog(`  > 🔍 Searching Docker Hub for: ${data.term}...`);
          const searchRes = await dockerService.searchImages(data.term);
          broadcastLog(`  > ✔ Found ${searchRes.length} images.`);
          return searchRes;

        case "pull_image":
          if (!data.imageName) throw new Error("Invalid image name");
          broadcastLog(`  > ⬇️ Pulling image: ${data.imageName}...`);
          const pullRes = await dockerService.pullImage(data.imageName);
          broadcastLog(`  > ✔ Image pulled: ${data.imageName}`);
          return pullRes;

        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
    } catch (err: any) {
      broadcastLog(`❌ Docker Job Failed: ${err.message}`);
      throw err;
    }
  },
  { connection, concurrency: 1 }
);