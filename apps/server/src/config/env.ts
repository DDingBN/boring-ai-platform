import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

const DEFAULT_NODE_ENV = 'development';
const DEFAULT_SERVER_HOST = '127.0.0.1';
const DEFAULT_SERVER_PORT = 3001;
// 这些只读列表同时作为运行时白名单和 TypeScript 联合类型的唯一来源。
const NODE_ENVS = ['development', 'test', 'production'] as const;
const AI_PROVIDERS = ['deepseek'] as const;
const DATABASE_PROTOCOLS = new Set(['postgres:', 'postgresql:']);

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

    // 服务可能从 monorepo 内任意目录启动，因此向上定位工作区根目录，而不是依赖当前目录。
    while (!existsSync(resolve(directory, 'pnpm-workspace.yaml'))) {
        const parentDirectory = resolve(directory, '..');

        if (parentDirectory === directory) {
            return;
        }

        directory = parentDirectory;
    }

    const envFile = resolve(directory, '.env');

    if (existsSync(envFile)) {
        // loadEnvFile 不会覆盖进程中已有的变量，部署环境显式注入的配置仍然优先。
        loadEnvFile(envFile);
    }
}

function readNodeEnv(value: string | undefined): NodeEnvironment {
    const nodeEnv = value ?? DEFAULT_NODE_ENV;

    if (!NODE_ENVS.includes(nodeEnv as NodeEnvironment)) {
        throw new Error(`NODE_ENV 必须是以下值之一：${NODE_ENVS.join('、')}。`);
    }

    return nodeEnv as NodeEnvironment;
}

function readPort(value: string | undefined): number {
    if (value === undefined || value === '') {
        return DEFAULT_SERVER_PORT;
    }

    if (!/^\d+$/.test(value)) {
        throw new Error('SERVER_PORT 必须是 1 到 65535 之间的整数。');
    }

    const port = Number(value);

    if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
        throw new Error('SERVER_PORT 必须是 1 到 65535 之间的整数。');
    }

    return port;
}

function readHost(value: string | undefined): string {
    const host = value?.trim() || DEFAULT_SERVER_HOST;

    if (/\s/.test(host)) {
        throw new Error('SERVER_HOST 不能包含空白字符。');
    }

    return host;
}

function readOptionalSecret(value: string | undefined, variableName: string): string | undefined {
    // 可选只表示配置层允许缺省；真正使用该能力时仍应由调用方检查是否已配置。
    if (value === undefined || value === '') {
        return undefined;
    }

    if (/\s/.test(value)) {
        throw new Error(`${variableName} 不能包含空白字符。`);
    }

    return value;
}

function readProvider(value: string | undefined): AiProvider {
    const provider = value ?? AI_PROVIDERS[0];

    if (!AI_PROVIDERS.includes(provider as AiProvider)) {
        throw new Error(`AI_PROVIDER 必须是以下值之一：${AI_PROVIDERS.join('、')}。`);
    }

    return provider as AiProvider;
}

function readDatabaseUrl(value: string | undefined): string | undefined {
    if (value === undefined || value === '') {
        return undefined;
    }

    if (/\s/.test(value)) {
        throw new Error('DATABASE_URL 不能包含空白字符。');
    }

    let url: URL;

    try {
        url = new URL(value);
    } catch {
        throw new Error('DATABASE_URL 必须是有效的数据库连接地址。');
    }

    if (!DATABASE_PROTOCOLS.has(url.protocol)) {
        throw new Error('DATABASE_URL 必须使用 postgresql 或 postgres 协议。');
    }

    return value;
}

export function loadServerConfig(): ServerConfig {
    loadProjectEnvFile();

    // 集中解析并校验，确保服务在启动阶段失败，而不是带着无效配置继续运行。
    return {
        databaseUrl: readDatabaseUrl(process.env.DATABASE_URL),
        deepSeekApiKey: readOptionalSecret(process.env.DEEPSEEK_API_KEY, 'DEEPSEEK_API_KEY'),
        host: readHost(process.env.SERVER_HOST),
        nodeEnv: readNodeEnv(process.env.NODE_ENV),
        port: readPort(process.env.SERVER_PORT),
        provider: readProvider(process.env.AI_PROVIDER),
    };
}
