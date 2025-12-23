"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.k8sWorker = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const child_process_1 = require("child_process");
const websocket_1 = require("../lib/websocket");
const connection = new ioredis_1.default(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});
function runKubectl(command) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error) {
                return reject(stderr || error.message);
            }
            resolve(stdout);
        });
    });
}
exports.k8sWorker = new bullmq_1.Worker("k8s-ops", async (job) => {
    (0, websocket_1.broadcastLog)(`☸️ Kubernetes Worker processing: ${job.name}`);
    try {
        switch (job.name) {
            case "k8s_cluster_info": {
                (0, websocket_1.broadcastLog)("  > Checking local Kubernetes cluster...");
                const output = await runKubectl("kubectl cluster-info");
                return { info: output };
            }
            case "k8s_get_pods": {
                (0, websocket_1.broadcastLog)("  > Fetching pods (default namespace)...");
                const output = await runKubectl("kubectl get pods -n default -o json");
                return JSON.parse(output);
            }
            case "k8s_get_services": {
                (0, websocket_1.broadcastLog)("  > Fetching services (default namespace)...");
                const output = await runKubectl("kubectl get services -n default -o json");
                return JSON.parse(output);
            }
            case "k8s_get_deployments": {
                (0, websocket_1.broadcastLog)("  > Fetching deployments (default namespace)...");
                const output = await runKubectl("kubectl get deployments -n default -o json");
                return JSON.parse(output);
            }
            default:
                throw new Error(`Unknown Kubernetes job: ${job.name}`);
        }
    }
    catch (err) {
        (0, websocket_1.broadcastLog)(`❌ Kubernetes Job Failed: ${err}`);
        throw err;
    }
}, { connection, concurrency: 1 });
