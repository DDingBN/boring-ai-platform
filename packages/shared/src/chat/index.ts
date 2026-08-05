export type ChatRole = 'system' | 'user' | 'assistant';

/**
 * 发送给 Server/模型的消息。
 * 不包含 id、createdAt，因为这些不是模型上下文所必需的。
 */
export interface ChatInputMessage {
    role: ChatRole;
    content: string;
}

/**
 * 页面展示的完整消息。
 */
export interface ChatMessage extends ChatInputMessage {
    id: string;
    createdAt: string;
}

/**
 * Web 发给 Server 的请求。
 */
export interface ChatRequest {
    messages: ChatInputMessage[];
}

/**
 * Server 返回新生成的 Assistant Message。
 */
export interface ChatResponse {
    message: ChatMessage;
}
