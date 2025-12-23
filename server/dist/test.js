"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const docker_1 = require("./docker");
async function main() {
    console.log("🔍 Testing Docker Connection...");
    const service = new docker_1.DockerService();
    try {
        const containers = await service.listContainers();
        console.log("✅ Success! Docker Daemon responded.");
        console.log("📦 Containers Found:", containers.length);
        console.table(containers);
    }
    catch (error) {
        console.error("❌ Failed. Reason:", error);
    }
}
main();
