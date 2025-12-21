// import { Router, Request, Response } from "express";
// import { dockerQueue, dockerQueueEvents, broadcastLog } from "../queue";

// const router = Router();

// router.post("/:toolName", async (req: Request, res: Response) => {
//   const { toolName } = req.params;
//   const args = req.body ?? {};

//   try {
//     broadcastLog(`⚡ Trigger via API: ${toolName}`);

//     const job = await dockerQueue.add(toolName, args);

//     const timeoutMs = toolName === "pull_image" ? 60000 : 10000;

//     const result = await job.waitUntilFinished(dockerQueueEvents, timeoutMs);

//     res.json({ result });
//   } catch (err: any) {
//     console.error(err);
//     res.status(500).json({ error: err.message || "Job Failed" });
//   }
// });

// export default router;











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

    // --- ROUTING LOGIC ---
    if (toolName === "generate_dockerfile") {
      // Route to Code Worker
      job = await codeQueue.add(toolName, args);
      result = await job.waitUntilFinished(codeQueueEvents, 5000);
    } 
    else {
      // Route to Docker Worker (Default)
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