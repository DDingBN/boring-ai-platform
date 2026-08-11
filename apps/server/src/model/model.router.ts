import { Router } from 'express';
import { notImplementedHandler } from '../middleware/not-implemented.middleware';

export const modelRouter = Router();

modelRouter.get('/', notImplementedHandler);
