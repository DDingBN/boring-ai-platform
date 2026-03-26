import express from "express";
import type { WorkflowGraph } from "@repo/shared";

const app = express();

app.get("/health", (_req, res) => {
  const demoGraph: WorkflowGraph = {
    nodes: [],
    edges: []
  };

  res.json({
    ok: true,
    graph: demoGraph
  });
});

app.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});