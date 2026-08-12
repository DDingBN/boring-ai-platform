import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { defineConfig, env } from 'prisma/config';

const configDirectory = dirname(fileURLToPath(import.meta.url));

dotenv.config({
    path: resolve(configDirectory, '../../.env'),
    override: false,
    quiet: true,
});

export default defineConfig({
    schema: resolve(configDirectory, 'prisma/schema.prisma'),
    datasource: {
        url: env('DATABASE_URL'),
    },
});
