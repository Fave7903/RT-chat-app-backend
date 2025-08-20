import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { Message } from '../models/message.model';
import { RoomMember } from '../models/roomMember.model';

const getMessagesSchema = z.object({
  params: z.object({ roomId: z.string().uuid() }),
  query: z.object({
    limit: z.string().optional(),
    cursor: z.string().datetime().optional(), // ISO date string; fetch older than this
  }),
});

export async function getRoomMessages(req: AuthRequest, res: Response) {
  const { roomId } = getMessagesSchema.parse({
    params: req.params,
    query: req.query,
  }).params;
  const { limit = '20', cursor } = req.query as any;

  const membership = await RoomMember.findOne({
    where: { userId: req.user!.id, roomId },
  });
  if (!membership)
    return res.status(403).json({ message: 'Not a room member' });

  const where: any = { roomId };
  if (cursor) where.createdAt = { lt: new Date(String(cursor)) } as any;

  const messages = await Message.findAll({
    where,
    order: [['createdAt', 'ASC']],
    limit: Math.min(parseInt(String(limit), 10) || 20, 100),
  });

  res.json({ messages });
}
