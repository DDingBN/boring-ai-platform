import type { WorkflowGraph } from "@repo/shared";

const demoGraph: WorkflowGraph = {
  nodes: [],
  edges: []
};

function App() {
  return <div>web is running, workflow nodes: {demoGraph.nodes.length}</div>;
}

export default App;
