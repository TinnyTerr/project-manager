import type { ProjectManager } from "./types/manager.ts";
import type { ProjectData } from "./types/project.ts";
import { loadProjects, saveProjects } from "./db/file.ts";
import { Logger } from "npm:@tinnyterr/logmatic@2.4.1"
import * as path from "@std/path"

const dir = path.parse(import.meta.dirname as string).dir
const projectDir = path.join(dir, "projects");

class Manager implements ProjectManager {
    projects: ProjectData[] = [];
    containers = [];
    traefikRoutes = [];
    logger = new Logger("Manager").loggers

    async init() {
        this.projects = await loadProjects();
        await this.updateProjects();
        for (const project of this.projects) {
            if (this.checkRequirements(project)) {
                await this.spinUpProject(project);
                this.addTraefikRoutes(project);
            }
        }
        this.resolvePortConflicts();
        await saveProjects(this.projects);
    }

    private async updateProjects() {
        for (const project of this.projects) {
            project.lastUpdated = new Date().toISOString();

            if (new Deno.Command("git", {
                args: ["pull"],
                cwd: path.join(projectDir, project.name)
            }).outputSync().code !== 0) {
                this.logger.warn(`Project ${project.name} failed to update, check git repo. Possibly use authenticated url (eg github tokens: https://ghp_...@github.com/user/repo.git)`)
            }
        }
    }

    checkRequirements(project: ProjectData): boolean {
        if (!("name" in project) || !("githubUrl" in project)) {
            // @ts-ignore: We must check.
            this.logger.error(`Project ${project.name} is missing key details (for example, like the name)`);
            return false
        }
    }

    async spinUpProject(project: ProjectData) {
        // call Docker API to run container
        this.containers.push({
            containerId: crypto.randomUUID(),
            project: project.name,
            ports: project.ports?.map(p => p.port) || [],
            networks: project.networks?.map(n => n.networkName) || [],
        });
    }

    addTraefikRoutes(project: ProjectData) {
        if (!project.ports) return;
        for (const port of project.ports) {
            this.traefikRoutes.push({
                project: project.name,
                port: port.port,
                required: port.required,
            });
        }
    }

    resolvePortConflicts() {
        const usedPorts = new Map<number, string>();
        for (const route of this.traefikRoutes) {
            if (usedPorts.has(route.port)) {
                const existing = usedPorts.get(route.port)!;
                if (route.required && !route.required) {
                    usedPorts.set(route.port, route.project);
                } else {
                    // both optional or existing required -> skip new
                    route.required = false;
                }
            } else {
                usedPorts.set(route.port, route.project);
            }
        }
    }
}

new Manager()