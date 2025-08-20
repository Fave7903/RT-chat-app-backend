import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export interface MessageReceiptAttributes {
  messageId: string;
  userId: string;
  readAt?: Date | null;
}

export class MessageReceipt
  extends Model<MessageReceiptAttributes>
  implements MessageReceiptAttributes
{
  public messageId!: string;
  public userId!: string;
  public readAt!: Date | null;
}

MessageReceipt.init(
  {
    messageId: { type: DataTypes.UUID, primaryKey: true },
    userId: { type: DataTypes.UUID, primaryKey: true },
    readAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'message_receipt' },
);
