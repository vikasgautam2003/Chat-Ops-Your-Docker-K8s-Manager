"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dockerWorker = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const docker_1 = require("../src/docker");
const websocket_1 = require("../lib/websocket");
const connection = new ioredis_1.default(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});
const dockerService = new docker_1.DockerService();
function validateContainerId(containerId) {
    if (!containerId || containerId === "container_id_value") {
        throw new Error("Invalid containerId provided");
    }
    if (!/^[a-f0-9]{5,64}$/i.test(containerId)) {
        throw new Error(`Invalid containerId format: ${containerId}`);
    }
}
exports.dockerWorker = new bullmq_1.Worker("docker-ops", async (job) => {
    (0, websocket_1.broadcastLog)(`🐳 Docker Worker processing: ${job.name}`);
    const data = job.data ?? {};
    try {
        const containerId = typeof data.containerId === "string" ? data.containerId.trim() : null;
        switch (job.name) {
            case "list_containers":
                (0, websocket_1.broadcastLog)("  > Connecting to Docker Daemon...");
                const containers = await dockerService.listContainers();
                (0, websocket_1.broadcastLog)(`  > Success: Retrieved ${containers.length} containers.`);
                return containers;
            case "start_container":
                validateContainerId(containerId);
                (0, websocket_1.broadcastLog)(`  > 🟢 Starting container: ${containerId}...`);
                const startRes = await dockerService.startContainer(containerId);
                (0, websocket_1.broadcastLog)("  > ✔ Container started.");
                return startRes;
            case "stop_container":
                validateContainerId(containerId);
                (0, websocket_1.broadcastLog)(`  > 🛑 Stopping container: ${containerId}...`);
                const stopRes = await dockerService.stopContainer(containerId);
                (0, websocket_1.broadcastLog)("  > ✔ Container stopped.");
                return stopRes;
            case "search_images":
                if (!data.term)
                    throw new Error("Invalid search term");
                (0, websocket_1.broadcastLog)(`  > 🔍 Searching Docker Hub for: ${data.term}...`);
                const searchRes = await dockerService.searchImages(data.term);
                (0, websocket_1.broadcastLog)(`  > ✔ Found ${searchRes.length} images.`);
                return searchRes;
            case "pull_image":
                if (!data.imageName)
                    throw new Error("Invalid image name");
                (0, websocket_1.broadcastLog)(`  > ⬇️ Pulling image: ${data.imageName}...`);
                const pullRes = await dockerService.pullImage(data.imageName);
                (0, websocket_1.broadcastLog)(`  > ✔ Image pulled: ${data.imageName}`);
                return pullRes;
            default:
                throw new Error(`Unknown job type: ${job.name}`);
        }
    }
    catch (err) {
        (0, websocket_1.broadcastLog)(`❌ Docker Job Failed: ${err.message}`);
        throw err;
    }
}, { connection, concurrency: 1 });
