import Docker from 'dockerode';

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

        try{

            const containers = await this.docker.listContainers({ all: true });

            return containers.map((container) => ({
                id: container.Id.substring(0, 12),
                name: container.Names[0].replace('/', ''),
                image: container.Image,
                state: container.State,
                status: container.Status,
            }));

        } catch (error) {
            console.error("Error connecting to Docker:", error);
            throw new Error("Failed to list containers. Is Docker Desktop running?");
        }
    }
}