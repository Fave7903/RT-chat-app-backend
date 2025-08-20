import { Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { Room } from '../models/room.model';
import { RoomMember } from '../models/roomMember.model';

const createRoomSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    isPrivate: z.boolean().optional().default(false),
  }),
});
const joinRoomSchema = z.object({
  body: z.object({
    roomId: z.string().uuid().optional(),
    inviteCode: z.string().optional(),
  }),
});
export const CreateRoomValidator = createRoomSchema;
export const JoinRoomValidator = joinRoomSchema;

export async function createRoom(req: AuthRequest, res: Response) {
  const { name, isPrivate } = createRoomSchema.parse({ body: req.body }).body;
  const inviteCode = isPrivate ? uuidv4().replace(/-/g, '').slice(0, 12) : null;
  const room = await Room.create({
    name,
    isPrivate: Boolean(isPrivate),
    inviteCode,
    createdBy: req.user!.id,
  });
  await RoomMember.create({
    userId: req.user!.id,
    roomId: room.id,
    role: 'admin',
  });
  res.status(201).json({ room });
}

export async function joinRoom(req: AuthRequest, res: Response) {
  const { roomId, inviteCode } = joinRoomSchema.parse({ body: req.body }).body;
  let room: Room | null = null;
  if (roomId) {
    room = await Room.findByPk(roomId);
  } else if (inviteCode) {
    room = await Room.findOne({ where: { inviteCode } });
  }
  if (!room) return res.status(404).json({ message: 'Room not found' });
  if (room.isPrivate && room.inviteCode !== inviteCode)
    return res.status(403).json({ message: 'Invite required' });

  const existing = await RoomMember.findOne({
    where: { userId: req.user!.id, roomId: room.id },
  });
  if (!existing)
    await RoomMember.create({
      userId: req.user!.id,
      roomId: room.id,
      role: 'member',
    });
  res.json({ room });
}

export async function myRooms(req: AuthRequest, res: Response) {
  const memberships = await RoomMember.findAll({
    where: { userId: req.user!.id },
  });
  res.json({ rooms: memberships.map((m) => m.roomId) });
}

export async function inviteLink(req: AuthRequest, res: Response) {
  const roomId = req.params.id;
  const room = await Room.findByPk(roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  const admin = await RoomMember.findOne({
    where: { userId: req.user!.id, roomId, role: 'admin' },
  });
  if (!admin)
    return res.status(403).json({ message: 'Only admins can get invite link' });

  if (!room.inviteCode) {
    room.inviteCode = uuidv4().replace(/-/g, '').slice(0, 12);
    await room.save();
  }
  res.json({ inviteCode: room.inviteCode });
}
