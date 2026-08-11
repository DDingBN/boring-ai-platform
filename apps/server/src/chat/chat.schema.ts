import { z } from 'zod';

export const chatRequestSchema = z
    .object({
        conversationId: z.string().trim().min(1).max(100).optional(),
        content: z.string().trim().min(1).max(2000),
    })
    .strict();

export interface ChatResponse {
    conversationId: string;
    message: {
        id: string;
        role: 'assistant';
        content: string;
        createdAt: string;
    };
}
