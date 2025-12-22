import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { exec } from "child_process";
import { broadcastLog } from "../lib/websocket";




const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});







function runKubectl(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr || error.message);
      }
      resolve(stdout);
    });
  });
}



export const k8sWorker = new Worker(
    "k8s-ops",
    async (job: Job) => {
        broadcastLog(`☸️ Kubernetes Worker processing: ${job.name}`);


        try{

          switch (job.name) {

               case "k8s_cluster_info": {
                broadcastLog("  > Checking local Kubernetes cluster...");
                const output = await runKubectl("kubectl cluster-info");
                return { info: output };
                }

                case "k8s_get_pods": {
                broadcastLog("  > Fetching pods (default namespace)...");
                const output = await runKubectl(
                    "kubectl get pods -n default -o json"
                );
                return JSON.parse(output);
                }

                case "k8s_get_services": {
                broadcastLog("  > Fetching services (default namespace)...");
                const output = await runKubectl(
                    "kubectl get services -n default -o json"
                );
                return JSON.parse(output);
                }

                case "k8s_get_deployments": {
                broadcastLog("  > Fetching deployments (default namespace)...");
                const output = await runKubectl(
                    "kubectl get deployments -n default -o json"
                );
                return JSON.parse(output);
                }

                default:
                    throw new Error(`Unknown Kubernetes job: ${job.name}`);
                }


        } catch (err: any) {
      broadcastLog(`❌ Kubernetes Job Failed: ${err}`);
      throw err;
    }
 
    },
     { connection, concurrency: 1 }
)