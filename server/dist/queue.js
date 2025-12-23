"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastLog = exports.k8sQueueEvents = exports.k8sQueue = exports.codeQueueEvents = exports.codeQueue = exports.dockerQueueEvents = exports.dockerQueue = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = process.env.REDIS_URL;
if (!connectionString)
    throw new Error("REDIS_URL missing");
// Factory to create fresh connections (Prevents Deadlocks)
const createConnection = () => {
    return new ioredis_1.default(connectionString, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    });
};
exports.dockerQueue = new bullmq_1.Queue("docker-ops", { connection: createConnection() });
exports.dockerQueueEvents = new bullmq_1.QueueEvents("docker-ops", { connection: createConnection() });
exports.codeQueue = new bullmq_1.Queue("code-gen", { connection: createConnection() });
exports.codeQueueEvents = new bullmq_1.QueueEvents("code-gen", { connection: createConnection() });
exports.k8sQueue = new bullmq_1.Queue("k8s-ops", {
    connection: createConnection(),
});
exports.k8sQueueEvents = new bullmq_1.QueueEvents("k8s-ops", {
    connection: createConnection(),
});
var websocket_1 = require("./lib/websocket");
Object.defineProperty(exports, "broadcastLog", { enumerable: true, get: function () { return websocket_1.broadcastLog; } });
