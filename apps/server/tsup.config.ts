import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    platform: 'node',
    target: 'node22',
    outDir: 'dist',
    bundle: true,
    splitting: false,
    clean: true,
    sourcemap: true,
    minify: false,
    dts: false,
    noExternal: ['@repo/shared', '@repo/ai', '@repo/database'],
});
