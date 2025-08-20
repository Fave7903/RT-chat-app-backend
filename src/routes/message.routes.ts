import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getRoomMessages } from '../controllers/message.controller';

const router = Router({ mergeParams: true });
router.get('/:roomId/messages', requireAuth, getRoomMessages);
export default router;
