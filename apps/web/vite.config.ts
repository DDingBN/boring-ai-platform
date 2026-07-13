import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const DEFAULT_WEB_HOST = '127.0.0.1';
const DEFAULT_WEB_PORT = 5173;
const projectRoot = fileURLToPath(new URL('../..', import.meta.url));

function readPort(value: string | undefined): number {
    if (value === undefined || value === '') {
        return DEFAULT_WEB_PORT;
    }

    if (!/^\d+$/.test(value)) {
        throw new Error('WEB_PORT must be an integer between 1 and 65535.');
    }

    const port = Number(value);

    if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
        throw new Error('WEB_PORT must be an integer between 1 and 65535.');
    }

    return port;
}

function readHost(value: string | undefined): string {
    const host = value?.trim() || DEFAULT_WEB_HOST;

    if (/\s/.test(host)) {
        throw new Error('WEB_HOST must not contain whitespace.');
    }

    return host;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, projectRoot, '');
    const host = readHost(env.WEB_HOST);
    const port = readPort(env.WEB_PORT);

    return {
        envDir: projectRoot,
        plugins: [react()],
        preview: {
            host,
        },
        server: {
            host,
            port,
        },
    };
});
