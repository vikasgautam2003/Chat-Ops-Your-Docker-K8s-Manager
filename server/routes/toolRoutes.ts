import { Router, Request, Response } from "express";
import { dockerQueue, dockerQueueEvents, broadcastLog } from "../queue";

const router = Router();

router.post("/:toolName", async (req: Request, res: Response) => {
  const { toolName } = req.params;
  const args = req.body ?? {};

  try {
    broadcastLog(`⚡ Trigger via API: ${toolName}`);

    const job = await dockerQueue.add(toolName, args);

    const timeoutMs = toolName === "pull_image" ? 60000 : 10000;

    const result = await job.waitUntilFinished(dockerQueueEvents, timeoutMs);

    res.json({ result });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Job Failed" });
  }
});

export default router;
