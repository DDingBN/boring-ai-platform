import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

const DEFAULT_WEB_HOST = '127.0.0.1';
const DEFAULT_WEB_PORT = 5173;
const DEFAULT_SERVER_HOST = '127.0.0.1';
const DEFAULT_SERVER_PORT = 3001;
const projectRoot = fileURLToPath(new URL('../..', import.meta.url));

function readPort(value, variableName, defaultValue) {
    if (value === undefined || value === '') {
        return defaultValue;
    }

    if (!/^\d+$/.test(value)) {
        throw new Error(`${variableName} must be an integer between 1 and 65535.`);
    }

    const port = Number(value);

    if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
        throw new Error(`${variableName} must be an integer between 1 and 65535.`);
    }

    return port;
}

function readHost(value, variableName, defaultValue) {
    const host = value?.trim() || defaultValue;

    if (/\s/.test(host)) {
        throw new Error(`${variableName} must not contain whitespace.`);
    }

    return host;
}

function toProxyHost(host) {
    if (host === '0.0.0.0' || host === '::') {
        return DEFAULT_SERVER_HOST;
    }

    return host.includes(':') && !host.startsWith('[') ? `[${host}]` : host;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, projectRoot, '');
    const host = readHost(env.WEB_HOST, 'WEB_HOST', DEFAULT_WEB_HOST);
    const port = readPort(env.WEB_PORT, 'WEB_PORT', DEFAULT_WEB_PORT);
    const serverHost = readHost(env.SERVER_HOST, 'SERVER_HOST', DEFAULT_SERVER_HOST);
    const serverPort = readPort(env.SERVER_PORT, 'SERVER_PORT', DEFAULT_SERVER_PORT);
    const proxyTarget = `http://${toProxyHost(serverHost)}:${serverPort}`;

    return {
        envDir: projectRoot,
        plugins: [vue()],
        preview: {
            host,
        },
        server: {
            host,
            port,
            proxy: {
                '/api': {
                    target: proxyTarget,
                    changeOrigin: true,
                },
            },
        },
    };
});
