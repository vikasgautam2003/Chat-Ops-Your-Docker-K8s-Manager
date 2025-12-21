import { Router, Request, Response } from "express";
import { 
  dockerQueue, dockerQueueEvents, 
  codeQueue, codeQueueEvents // Import new queue
} from "../queue";
import { broadcastLog } from "../lib/websocket";

const router = Router();

router.post("/:toolName", async (req: Request, res: Response) => {
  const { toolName } = req.params;
  const args = req.body ?? {};

  try {
    broadcastLog(`⚡ API received: ${toolName}`);

    let job;
    let result;

    if (toolName === "generate_dockerfile" || toolName === "generate_k8s_manifest") {
    
      job = await codeQueue.add(toolName, args);
      result = await job.waitUntilFinished(codeQueueEvents, 5000);
    } 
    else {
     
      job = await dockerQueue.add(toolName, args);
      const timeout = toolName === 'pull_image' ? 60000 : 10000;
      result = await job.waitUntilFinished(dockerQueueEvents, timeout);
    }

    res.json({ result });

  } catch (err: any) {
    res.status(500).json({ error: err.message || "Job Failed" });
  }
});

export default router;