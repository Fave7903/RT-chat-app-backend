import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface RoomAttributes {
  id: string;
  name: string;
  isPrivate: boolean;
  inviteCode?: string | null;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export type RoomCreation = Optional<
  RoomAttributes,
  'id' | 'inviteCode' | 'createdAt' | 'updatedAt'
>;

export class Room
  extends Model<RoomAttributes, RoomCreation>
  implements RoomAttributes
{
  public id!: string;
  public name!: string;
  public isPrivate!: boolean;
  public inviteCode!: string | null;
  public createdBy!: string;
}

Room.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(120), allowNull: false },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    inviteCode: { type: DataTypes.STRING(64), allowNull: true, unique: true },
    createdBy: { type: DataTypes.UUID, allowNull: false },
  },
  { sequelize, modelName: 'room' },
);
