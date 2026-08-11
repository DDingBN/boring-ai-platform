import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { chatRequestSchema, type ChatResponse } from './chat.schema';
import { createSuccessResponse } from '../utils/api-response';
import { createConversation } from '../conversation/conversation.service';

export const chatRouter = Router();

chatRouter.post('/messages', (req, res) => {
    const result = chatRequestSchema.safeParse(req.body);

    if (!result.success) {
        const error = new Error('Invalid chat request.', { cause: result.error }) as Error & {
            status: number;
        };

        error.status = 400;
        throw error;
    }

    const conversationId = result.data.conversationId ?? createConversation().id;

    const response: ChatResponse = {
        conversationId,
        message: {
            id: randomUUID(),
            role: 'assistant',
            content: `Server 已收到：${result.data.content}`,
            createdAt: new Date().toISOString(),
        },
    };

    res.status(200).json(createSuccessResponse(response));
});
