import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import { sequelize } from './models';
import { createSocketServer } from './socket';

dotenv.config();

const PORT = Number(process.env.PORT || 8080);

async function start() {
  await sequelize.authenticate();
  await sequelize.sync(); // For production prefer migrations
  const server = http.createServer(app);
  createSocketServer(server);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
