export type WorkflowNodeType = 'start' | 'prompt' | 'llm' | 'tool' | 'rag' | 'end';

export interface WorkflowNodePosition {
    x: number;
    y: number;
}

export interface WorkflowNodeData {
    label: string;
    config: Record<string, unknown>;
}

export interface WorkflowNode {
    id: string;
    type: WorkflowNodeType;
    position: WorkflowNodePosition;
    data: WorkflowNodeData;
}

export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
}

export interface WorkflowGraph {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}
