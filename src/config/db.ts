import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const {
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_SSL,
  NODE_ENV,
} = process.env as Record<string, string>;

const useUrl = Boolean(DATABASE_URL);

export const sequelize = useUrl
  ? new Sequelize(DATABASE_URL!, {
      dialect: 'mysql',
      logging: NODE_ENV !== 'production' ? console.log : false,
      dialectOptions:
        DB_SSL === 'true'
          ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } }
          : {},
    })
  : new Sequelize(DB_NAME, DB_USER, DB_PASS, {
      username: DB_USER,
      password: DB_PASS,
      host: DB_HOST,
      port: Number(DB_PORT),
      dialect: 'mysql',
      logging: NODE_ENV !== 'production' ? console.log : false,
      dialectOptions:
        DB_SSL === 'true'
          ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } }
          : {},
    });
