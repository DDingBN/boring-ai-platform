import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

const DEFAULT_NODE_ENV = 'development';
const DEFAULT_SERVER_HOST = '127.0.0.1';
const DEFAULT_SERVER_PORT = 3001;
const NODE_ENVS = ['development', 'test', 'production'] as const;
const AI_PROVIDERS = ['deepseek'] as const;
const DATABASE_PROTOCOLS = new Set(['file:', 'mysql:', 'postgres:', 'postgresql:']);

type NodeEnvironment = (typeof NODE_ENVS)[number];
type AiProvider = (typeof AI_PROVIDERS)[number];

export interface ServerConfig {
    databaseUrl?: string;
    deepSeekApiKey?: string;
    host: string;
    nodeEnv: NodeEnvironment;
    port: number;
    provider: AiProvider;
}

function loadProjectEnvFile(): void {
    let directory = process.cwd();

    while (!existsSync(resolve(directory, 'pnpm-workspace.yaml'))) {
        const parentDirectory = resolve(directory, '..');

        if (parentDirectory === directory) {
            return;
        }

        directory = parentDirectory;
    }

    const envFile = resolve(directory, '.env');

    if (existsSync(envFile)) {
        loadEnvFile(envFile);
    }
}

function readNodeEnv(value: string | undefined): NodeEnvironment {
    const nodeEnv = value ?? DEFAULT_NODE_ENV;

    if (!NODE_ENVS.includes(nodeEnv as NodeEnvironment)) {
        throw new Error(`NODE_ENV must be one of: ${NODE_ENVS.join(', ')}.`);
    }

    return nodeEnv as NodeEnvironment;
}

function readPort(value: string | undefined): number {
    if (value === undefined || value === '') {
        return DEFAULT_SERVER_PORT;
    }

    if (!/^\d+$/.test(value)) {
        throw new Error('SERVER_PORT must be an integer between 1 and 65535.');
    }

    const port = Number(value);

    if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
        throw new Error('SERVER_PORT must be an integer between 1 and 65535.');
    }

    return port;
}

function readHost(value: string | undefined): string {
    const host = value?.trim() || DEFAULT_SERVER_HOST;

    if (/\s/.test(host)) {
        throw new Error('SERVER_HOST must not contain whitespace.');
    }

    return host;
}

function readOptionalSecret(value: string | undefined, variableName: string): string | undefined {
    if (value === undefined || value === '') {
        return undefined;
    }

    if (/\s/.test(value)) {
        throw new Error(`${variableName} must not contain whitespace.`);
    }

    return value;
}

function readProvider(value: string | undefined): AiProvider {
    const provider = value ?? AI_PROVIDERS[0];

    if (!AI_PROVIDERS.includes(provider as AiProvider)) {
        throw new Error(`AI_PROVIDER must be one of: ${AI_PROVIDERS.join(', ')}.`);
    }

    return provider as AiProvider;
}

function readDatabaseUrl(value: string | undefined): string | undefined {
    if (value === undefined || value === '') {
        return undefined;
    }

    if (/\s/.test(value)) {
        throw new Error('DATABASE_URL must not contain whitespace.');
    }

    let url: URL;

    try {
        url = new URL(value);
    } catch {
        throw new Error('DATABASE_URL must be a valid database connection URL.');
    }

    if (!DATABASE_PROTOCOLS.has(url.protocol)) {
        throw new Error('DATABASE_URL must use postgresql, postgres, mysql, or file protocol.');
    }

    return value;
}

export function loadServerConfig(): ServerConfig {
    loadProjectEnvFile();

    return {
        databaseUrl: readDatabaseUrl(process.env.DATABASE_URL),
        deepSeekApiKey: readOptionalSecret(process.env.DEEPSEEK_API_KEY, 'DEEPSEEK_API_KEY'),
        host: readHost(process.env.SERVER_HOST),
        nodeEnv: readNodeEnv(process.env.NODE_ENV),
        port: readPort(process.env.SERVER_PORT),
        provider: readProvider(process.env.AI_PROVIDER),
    };
}
