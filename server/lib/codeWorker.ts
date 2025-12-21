import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { broadcastLog } from "../lib/websocket";

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const codeWorker = new Worker(
  "code-gen",
  async (job: Job) => {
    broadcastLog(`📝 CodeGen Worker processing: ${job.name}`);
    const data = job.data ?? {};

    try {
      switch (job.name) {
        case "generate_dockerfile": {
          const { language } = data;
          broadcastLog(`  > Generating Bulletproof Dockerfile for ${language}...`);

  
          await new Promise(r => setTimeout(r, 500));

          let content = "";
          
          if (language.toLowerCase().includes("node")) {
             content = `# NODE.JS BULLETPROOF BUILD\n# Multi-stage build for production\n\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:18-alpine AS runner\nWORKDIR /app\nENV NODE_ENV production\nRUN addgroup --system --gid 1001 nodejs\nRUN adduser --system --uid 1001 nextjs\nCOPY --from=builder /app/public ./public\nCOPY --from=builder /app/.next ./.next\nCOPY --from=builder /app/node_modules ./node_modules\nUSER nextjs\nEXPOSE 3000\nCMD ["npm", "start"]`;
          } 
          else if (language.toLowerCase().includes("python")) {
             content = `# PYTHON SLIM BUILD\nFROM python:3.9-slim\nWORKDIR /app\nENV PYTHONDONTWRITEBYTECODE 1\nENV PYTHONUNBUFFERED 1\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nRUN useradd -m myuser\nUSER myuser\nCMD ["python", "app.py"]`;
          }
          else {
             content = `# GENERIC DOCKERFILE\nFROM ${language}:latest\nWORKDIR /app\nCOPY . .\nCMD ["run"]`;
          }

          broadcastLog(`  > ✔ Code Generated Successfully.`);
          return { code: content, language: "dockerfile" };
        }

        case "generate_k8s_manifest": {
        const { imageName, port = "3000", replicas = "2" } = data;
        broadcastLog(`  > ☸️ Generating Kubernetes Manifests for ${imageName}...`);

      
        await new Promise(r => setTimeout(r, 500));

        const cleanName = imageName.replace(/[:/.]/g, "-");

        const content = `# -------------------
        # 🚀 KUBERNETES DEPLOYMENT
        # -------------------
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: ${cleanName}-deploy
        spec:
          replicas: ${replicas}
          selector:
            matchLabels:
              app: ${cleanName}
          template:
            metadata:
              labels:
                app: ${cleanName}
            spec:
              containers:
              - name: ${cleanName}
                image: ${imageName}
                ports:
                - containerPort: ${port}
                resources:
                  limits:
                    memory: "512Mi"
                    cpu: "500m"

        ---
        # -------------------
        # 🌐 LOAD BALANCER SERVICE
        # -------------------
        apiVersion: v1
        kind: Service
        metadata:
          name: ${cleanName}-service
        spec:
          selector:
            app: ${cleanName}
          ports:
            - protocol: TCP
              port: 80
              targetPort: ${port}
          type: LoadBalancer`;

        broadcastLog(`  > ✔ Manifests Generated.`);
        return { code: content, language: "yaml", filename: "k8s-deployment.yaml" };
      }
        default:
          throw new Error(`Unknown code job: ${job.name}`);
      }
    } catch (err: any) {
      broadcastLog(`❌ Code Job Failed: ${err.message}`);
      throw err;
    }
  },
  { connection }
);