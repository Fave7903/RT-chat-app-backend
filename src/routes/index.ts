import { Router } from 'express';
import auth from './auth.routes';
import rooms from './room.routes';
import msgs from './message.routes';

const router = Router();
router.use('/auth', auth);
router.use('/rooms', rooms);
router.use('/rooms', msgs); // msgs expects /rooms/:roomId/messages
export default router;
