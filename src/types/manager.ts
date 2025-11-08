import type { ProjectData, ProjectStatus } from "./project.ts";

export type DockerContainerInfo = {
  containerId: string;
  project: string;
  ports: number[];
  networks: string[];
  status: ProjectStatus
};

export type TraefikRouteInfo = {
  project: string;
  port: number;
  required: boolean;
};

export interface ProjectManager {
  projects: ProjectData[];
  containers: DockerContainerInfo[];
  traefikRoutes: TraefikRouteInfo[];

  init(): Promise<void>;
  updateProjects(): Promise<void>;
  checkRequirements(project: ProjectData): boolean;
  spinUpProject(project: ProjectData): Promise<void>;
  addTraefikRoutes(project: ProjectData): void;
  resolvePortConflicts(): void;
}