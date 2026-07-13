import { Router } from 'express';

export const chatRouter = Router();

chatRouter.post('/', (req, res) => {
    res.json({ message: 'Chat response' });
});
