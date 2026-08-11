import { randomUUID } from 'node:crypto';

export interface CreatedConversation {
    id: string;
}

// 当前只生成会话标识；持久化和模型配置将在实现会话模块时补充。
export function createConversation(): CreatedConversation {
    return { id: randomUUID() };
}
