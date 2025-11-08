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
