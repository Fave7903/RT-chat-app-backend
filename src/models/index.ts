import { sequelize } from '../config/db';
import { User } from './user.model';
import { Room } from './room.model';
import { RoomMember } from './roomMember.model';
import { Message } from './message.model';
import { MessageReceipt } from './messageReceipt.model';

// User ↔ Room (via RoomMember)
User.belongsToMany(Room, {
  through: RoomMember,
  foreignKey: 'userId',
  otherKey: 'roomId',
  as: 'rooms',
});
Room.belongsToMany(User, {
  through: RoomMember,
  foreignKey: 'roomId',
  otherKey: 'userId',
  as: 'members',
});

// RoomMember direct refs
RoomMember.belongsTo(User, { foreignKey: 'userId' });
RoomMember.belongsTo(Room, { foreignKey: 'roomId' });
User.hasMany(RoomMember, { foreignKey: 'userId' });
Room.hasMany(RoomMember, { foreignKey: 'roomId' });

// Messages
Message.belongsTo(User, { foreignKey: 'userId', as: 'sender' });
Message.belongsTo(Room, { foreignKey: 'roomId' });
User.hasMany(Message, { foreignKey: 'userId' });
Room.hasMany(Message, { foreignKey: 'roomId' });

// (Bonus) Read receipts
MessageReceipt.belongsTo(Message, { foreignKey: 'messageId' });
MessageReceipt.belongsTo(User, { foreignKey: 'userId' });
Message.hasMany(MessageReceipt, { foreignKey: 'messageId' });
User.hasMany(MessageReceipt, { foreignKey: 'userId' });

export { sequelize, User, Room, RoomMember, Message, MessageReceipt };
