import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { RoomMember } from '../models/roomMember.model';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { MessageRateLimiter } from './rateLimiter';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

// online presence tracking
const onlineUsers = new Map<string, Set<string>>(); // userId -> socketIds
const limiter = new MessageRateLimiter(5, 10_000); // 5 msgs / 10s

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  // Auth middleware for sockets
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers['authorization']
        ?.toString()
        .replace('Bearer ', '');
    if (!token) return next(new Error('Unauthorized'));
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      (socket.data as any).user = {
        id: payload.id,
        email: payload.email,
        username: payload.username,
      };
      next();
    } catch (e) {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', async (socket) => {
    const user = (socket.data as any).user as { id: string; username: string };

    // track online
    const set = onlineUsers.get(user.id) || new Set<string>();
    set.add(socket.id);
    onlineUsers.set(user.id, set);

    // presence broadcast to rooms where the user is a member
    const memberships = await RoomMember.findAll({
      where: { userId: user.id },
    });
    for (const m of memberships) {
      socket.join(m.roomId); // auto-join known rooms to receive presence
      io.to(m.roomId).emit('user_status', {
        userId: user.id,
        online: true,
        lastSeen: null,
      });
    }

    socket.on(
      'join_room',
      async ({
        roomId,
        inviteCode,
      }: {
        roomId: string;
        inviteCode?: string;
      }) => {
        const membership = await RoomMember.findOne({
          where: { userId: user.id, roomId },
        });
        if (!membership) {
          const { Room } = await import('../models/room.model');
          const room = await Room.findByPk(roomId);
          if (!room) return socket.emit('error', { message: 'Room not found' });
          if (room.isPrivate && room.inviteCode !== inviteCode)
            return socket.emit('error', { message: 'Invite required' });
          await RoomMember.create({ userId: user.id, roomId, role: 'member' });
        }
        socket.join(roomId);
        io.to(roomId).emit('user_status', {
          userId: user.id,
          online: true,
          lastSeen: null,
        });
      },
    );

    socket.on(
      'typing',
      ({ roomId, isTyping }: { roomId: string; isTyping: boolean }) => {
        socket.to(roomId).emit('typing', { userId: user.id, isTyping });
      },
    );

    socket.on(
      'send_message',
      async ({ roomId, content }: { roomId: string; content: string }) => {
        if (!content || !content.trim())
          return socket.emit('error', { message: 'Empty message' });
        const membership = await RoomMember.findOne({
          where: { userId: user.id, roomId },
        });
        if (!membership)
          return socket.emit('error', { message: 'Not a room member' });
        const key = `${user.id}:${roomId}`;
        if (!limiter.allow(key))
          return socket.emit('error', { message: 'Rate limit exceeded' });

        const msg = await Message.create({
          roomId,
          userId: user.id,
          content: content.trim(),
          deliveredAt: new Date(),
        });
        const payload = {
          id: msg.id,
          roomId,
          userId: user.id,
          content: msg.content,
          createdAt: msg.createdAt,
          deliveredAt: msg.deliveredAt,
        };
        io.to(roomId).emit('receive_message', payload);
      },
    );

    socket.on('read_receipt', async ({ messageId }: { messageId: string }) => {
      try {
        const { MessageReceipt } = await import(
          '../models/messageReceipt.model'
        );
        await MessageReceipt.upsert({
          messageId,
          userId: user.id,
          readAt: new Date(),
        });
        const msg = await Message.findByPk(messageId);
        if (msg && !msg.readAt) {
          msg.readAt = new Date();
          await msg.save();
        }
        if (msg)
          io.to(msg.roomId).emit('read_receipt', {
            messageId,
            userId: user.id,
            readAt: new Date(),
          });
      } catch {}
    });

    socket.on('disconnect', async () => {
      const set = onlineUsers.get(user.id);
      if (set) {
        set.delete(socket.id);
        if (set.size === 0) {
          onlineUsers.delete(user.id);
          await User.update(
            { lastSeen: new Date() },
            { where: { id: user.id } },
          );
          for (const m of memberships) {
            io.to(m.roomId).emit('user_status', {
              userId: user.id,
              online: false,
              lastSeen: dayjs().toISOString(),
            });
          }
        } else {
          onlineUsers.set(user.id, set);
        }
      }
    });
  });

  return io;
}
