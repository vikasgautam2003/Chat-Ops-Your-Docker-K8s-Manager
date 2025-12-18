import { DockerService } from './docker';

async function main() {
  console.log("🔍 Testing Docker Connection...");
  
  const service = new DockerService();
  
  try {
    const containers = await service.listContainers();
    console.log("✅ Success! Docker Daemon responded.");
    console.log("📦 Containers Found:", containers.length);
    console.table(containers); 
  } catch (error) {
    console.error("❌ Failed. Reason:", error);
  }
}

main();