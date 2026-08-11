import { Router } from 'express';
import { notImplementedHandler } from '../middleware/not-implemented.middleware';

export const conversationRouter = Router();

conversationRouter.get('/', notImplementedHandler);
conversationRouter.get('/:conversationId/messages', notImplementedHandler);
conversationRouter.get('/:conversationId', notImplementedHandler);
conversationRouter.patch('/:conversationId', notImplementedHandler);
conversationRouter.delete('/:conversationId', notImplementedHandler);
