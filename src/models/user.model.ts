import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface UserAttributes {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  lastSeen?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
export type UserCreation = Optional<
  UserAttributes,
  'id' | 'lastSeen' | 'createdAt' | 'updatedAt'
>;

export class User
  extends Model<UserAttributes, UserCreation>
  implements UserAttributes
{
  public id!: string;
  public email!: string;
  public username!: string;
  public passwordHash!: string;
  public lastSeen!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(191),
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING(191), allowNull: false },
    lastSeen: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'user' },
);
