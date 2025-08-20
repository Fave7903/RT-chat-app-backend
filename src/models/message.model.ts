import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface MessageAttributes {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  createdAt?: Date;
  deliveredAt?: Date | null;
  readAt?: Date | null;
}
export type MessageCreation = Optional<
  MessageAttributes,
  'id' | 'createdAt' | 'deliveredAt' | 'readAt'
>;

export class Message
  extends Model<MessageAttributes, MessageCreation>
  implements MessageAttributes
{
  public id!: string;
  public roomId!: string;
  public userId!: string;
  public content!: string;
  public createdAt!: Date;
  public deliveredAt!: Date | null;
  public readAt!: Date | null;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roomId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    deliveredAt: { type: DataTypes.DATE, allowNull: true },
    readAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'message' },
);
