import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface RoomMemberAttributes {
  id: string;
  userId: string;
  roomId: string;
  role: 'member' | 'admin';
  joinedAt?: Date;
}
export type RoomMemberCreation = Optional<
  RoomMemberAttributes,
  'id' | 'role' | 'joinedAt'
>;

export class RoomMember
  extends Model<RoomMemberAttributes, RoomMemberCreation>
  implements RoomMemberAttributes
{
  public id!: string;
  public userId!: string;
  public roomId!: string;
  public role!: 'member' | 'admin';
  public joinedAt!: Date;
}

RoomMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: { type: DataTypes.UUID, allowNull: false },
    roomId: { type: DataTypes.UUID, allowNull: false },
    role: {
      type: DataTypes.ENUM('member', 'admin'),
      defaultValue: 'member',
      allowNull: false,
    },
    joinedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: 'room_member',
    indexes: [{ unique: true, fields: ['userId', 'roomId'] }],
  },
);
