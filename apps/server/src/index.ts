import express from 'express';
import type { WorkflowGraph } from '@repo/shared';
import { loadServerConfig } from './config/env';

const app = express();
const config = loadServerConfig();

app.get('/health', (_req, res) => {
    const demoGraph: WorkflowGraph = {
        nodes: [],
        edges: [],
    };

    res.json({
        ok: true,
        graph: demoGraph,
    });
});

app.listen(config.port, config.host, () => {
    console.log(`server running at http://${config.host}:${config.port}`);
});
