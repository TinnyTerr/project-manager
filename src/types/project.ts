export type PortRequirement = {
    port: number;
    required: boolean;
    subdomain: string; // eg ${subdomain}.example.com
};

export type FileAccessRequirement = {
    store: string;
    read: boolean;
    write: boolean;
    required: boolean;
};

export type ProjectData = {
    name: string;
    githubUrl: string;
    branch?: string;
    commit?: string;
    lastUpdated?: string; // ISO string
    ports?: PortRequirement[];
    files?: FileAccessRequirement[];
};

export type ProjectStatus = "pending" | "updating" | "running" | "error";