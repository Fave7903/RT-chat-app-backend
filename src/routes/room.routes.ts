import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  createRoom,
  joinRoom,
  myRooms,
  inviteLink,
  CreateRoomValidator,
  JoinRoomValidator,
} from '../controllers/room.controller';
import { validate } from '../middleware/validation';

const router = Router();
router.post('/', requireAuth, validate(CreateRoomValidator), createRoom);
router.post('/join', requireAuth, validate(JoinRoomValidator), joinRoom);
router.get('/mine', requireAuth, myRooms);
router.get('/:id/invite', requireAuth, inviteLink);
export default router;
