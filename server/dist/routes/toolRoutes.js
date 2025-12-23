"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const queue_1 = require("../queue");
const websocket_1 = require("../lib/websocket");
const router = (0, express_1.Router)();
router.post("/:toolName", async (req, res) => {
    const { toolName } = req.params;
    const args = req.body ?? {};
    try {
        (0, websocket_1.broadcastLog)(`⚡ API received: ${toolName}`);
        let job;
        let result;
        if (toolName === "generate_dockerfile" || toolName === "generate_k8s_manifest") {
            job = await queue_1.codeQueue.add(toolName, args);
            result = await job.waitUntilFinished(queue_1.codeQueueEvents, 5000);
        }
        else if (toolName.startsWith("k8s_")) {
            job = await queue_1.k8sQueue.add(toolName, args);
            result = await job.waitUntilFinished(queue_1.k8sQueueEvents, 15000);
        }
        else {
            job = await queue_1.dockerQueue.add(toolName, args);
            const timeout = toolName === 'pull_image' ? 60000 : 10000;
            result = await job.waitUntilFinished(queue_1.dockerQueueEvents, timeout);
        }
        res.json({ result });
    }
    catch (err) {
        res.status(500).json({ error: err.message || "Job Failed" });
    }
});
exports.default = router;
