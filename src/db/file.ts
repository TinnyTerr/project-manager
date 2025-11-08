import type { ProjectData } from "../types/project.ts";
import * as path from "@std/path"

const dir = path.parse(import.meta.dirname as string).dir
const DB_FILE = path.join(dir, "data/common.json");

export async function loadProjects(): Promise<ProjectData[]> {
    try {
        const raw = await Deno.readTextFile(DB_FILE);
        return JSON.parse(raw) as ProjectData[];
    } catch {
        return [];
    }
}

export async function saveProjects(projects: ProjectData[]): Promise<void> {
    await Deno.writeTextFile(DB_FILE, JSON.stringify(projects, null, 2));
}

export class Db {
    protected projects: ProjectData[] = []
    constructor() {
        (async () => {
            const raw = await Deno.readTextFile(DB_FILE);

            this.projects = JSON.parse(raw) as ProjectData[];
        })();
    }

    readProjects(): ProjectData[] {
        return this.projects;
    }

    find(filter: Partial<ProjectData>) {
        const  {
            name,
            githubUrl,
            branch,
            commit,
            lastUpdated,
            ports,
            files,
        } = filter;

        const arr = [];

        for (const project of this.projects) {
            if (
                name ?? project.name === project.name &&
                githubUrl ?? project.githubUrl === project.githubUrl &&
                branch ?? project.branch === project.branch &&
                commit ?? project.commit === project.commit &&
                lastUpdated ?? project.lastUpdated === project.lastUpdated &&
                ports ?? project.ports === project.ports &&
                files ?? project.files === project.files
            ) {
                arr.push(project)
            }
        }

        return arr;
    }

    findOne(filter: Partial<ProjectData>) {
        const  {
            name,
            githubUrl,
            branch,
            commit,
            lastUpdated,
            ports,
            files,
        } = filter;

        for (const project of this.projects) {
            if (
                name ?? project.name === project.name &&
                githubUrl ?? project.githubUrl === project.githubUrl &&
                branch ?? project.branch === project.branch &&
                commit ?? project.commit === project.commit &&
                lastUpdated ?? project.lastUpdated === project.lastUpdated &&
                ports ?? project.ports === project.ports &&
                files ?? project.files === project.files
            ) {
                return project
            }
        }

        return null;
    }

    updateOne(name: string, data: Partial<ProjectData>) {
        for (const index in this.projects) {
            const project = this.projects[index]
            
            if (
                name === project.name
            ) {
                this.projects[index] = data && project;

                return project
            }
        }

        return null;
    }
}