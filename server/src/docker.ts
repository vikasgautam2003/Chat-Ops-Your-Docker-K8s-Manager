// import Docker from 'dockerode';

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











import Docker from "dockerode";
import { exec } from "child_process";

export interface SimpleContainer {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
}

export class DockerService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  async listContainers(): Promise<SimpleContainer[]> {
    try {
      const containers = await this.docker.listContainers({ all: true });

      return containers.map((container) => ({
        id: container.Id.substring(0, 12),
        name: container.Names[0].replace("/", ""),
        image: container.Image,
        state: container.State,
        status: container.Status,
      }));
    } catch (error) {
      console.error("Error connecting to Docker:", error);
      throw new Error("Failed to list containers. Is Docker Desktop running?");
    }
  }

  async startContainer(containerId: string) {
    const cleanId = containerId.trim();
    const container = this.docker.getContainer(cleanId);
    await container.start();
    return {
      containerId: cleanId.substring(0, 12),
      action: "start",
      success: true,
    };
  }

  async stopContainer(containerId: string) {
    const cleanId = containerId.trim();
    const container = this.docker.getContainer(cleanId);
    await container.stop();
    return {
      containerId: cleanId.substring(0, 12),
      action: "stop",
      success: true,
    };
  }

  async searchImages(term: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      exec(
        `docker search "${term}" --limit 9 --format "{{json .}}"`,
        (err, stdout) => {
          if (err) {
            return reject(
              new Error(`Failed to search images for term: ${term}`)
            );
          }

          try {
            const results = stdout
              .trim()
              .split("\n")
              .filter(Boolean)
              .map((line) => JSON.parse(line));

            resolve(results);
          } catch (parseErr) {
            reject(new Error("Failed to parse docker search output"));
          }
        }
      );
    });
  }

  async pullImage(imageName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(`docker pull ${imageName}`, (err, stdout) => {
        if (err) {
          return reject(
            new Error(`Failed to pull image: ${imageName}`)
          );
        }
        resolve(stdout);
      });
    });
  }
}
