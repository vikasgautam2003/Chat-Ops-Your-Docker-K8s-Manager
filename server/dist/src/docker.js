"use strict";
// import Docker from 'dockerode';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerService = void 0;
// export interface SimpleContainer {
//   id: string;
//   name: string;
//   image: string;
//   state: string;
//   status: string;
// }
// export class DockerService {
//     private docker: Docker;
//     constructor() {
//         this.docker = new Docker();
//     }
//     async listContainers(): Promise<SimpleContainer[]> {
//         try{
//             const containers = await this.docker.listContainers({ all: true });
//             return containers.map((container) => ({
//                 id: container.Id.substring(0, 12),
//                 name: container.Names[0].replace('/', ''),
//                 image: container.Image,
//                 state: container.State,
//                 status: container.Status,
//             }));
//         } catch (error) {
//             console.error("Error connecting to Docker:", error);
//             throw new Error("Failed to list containers. Is Docker Desktop running?");
//         }
//     }
//     async startContainer(containerId: string) {
//         const container = this.docker.getContainer(containerId);
//         await container.start();
//         return { status: "started", id: containerId };
//     }
//     async stopContainer(containerId: string) {
//         const container = this.docker.getContainer(containerId);
//         await container.stop();
//         return { status: "stopped", id: containerId };
//     }
// }
const dockerode_1 = __importDefault(require("dockerode"));
const child_process_1 = require("child_process");
class DockerService {
    docker;
    constructor() {
        this.docker = new dockerode_1.default();
    }
    async listContainers() {
        try {
            const containers = await this.docker.listContainers({ all: true });
            return containers.map((container) => ({
                id: container.Id.substring(0, 12),
                name: container.Names[0].replace("/", ""),
                image: container.Image,
                state: container.State,
                status: container.Status,
            }));
        }
        catch (error) {
            console.error("Error connecting to Docker:", error);
            throw new Error("Failed to list containers. Is Docker Desktop running?");
        }
    }
    async startContainer(containerId) {
        const cleanId = containerId.trim();
        const container = this.docker.getContainer(cleanId);
        await container.start();
        return {
            containerId: cleanId.substring(0, 12),
            action: "start",
            success: true,
        };
    }
    async stopContainer(containerId) {
        const cleanId = containerId.trim();
        const container = this.docker.getContainer(cleanId);
        await container.stop();
        return {
            containerId: cleanId.substring(0, 12),
            action: "stop",
            success: true,
        };
    }
    async searchImages(term) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`docker search "${term}" --limit 9 --format "{{json .}}"`, (err, stdout) => {
                if (err) {
                    return reject(new Error(`Failed to search images for term: ${term}`));
                }
                try {
                    const results = stdout
                        .trim()
                        .split("\n")
                        .filter(Boolean)
                        .map((line) => JSON.parse(line));
                    resolve(results);
                }
                catch (parseErr) {
                    reject(new Error("Failed to parse docker search output"));
                }
            });
        });
    }
    async pullImage(imageName) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`docker pull ${imageName}`, (err, stdout) => {
                if (err) {
                    return reject(new Error(`Failed to pull image: ${imageName}`));
                }
                resolve(stdout);
            });
        });
    }
}
exports.DockerService = DockerService;
