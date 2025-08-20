// client/user1.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
  auth: { token: 'JWT_TOKEN' }, // replace with real token
});

socket.on('connect', () => {
  console.log('User1 connected:', socket.id);

  // join a room
  socket.emit('join_room', { roomId: 'ea66e458-7f8f-470e-a7e9-13e0dc024425' });

  // send message after join
  setTimeout(() => {
    socket.emit('send_message', {
      roomId: 'ea66e458-7f8f-470e-a7e9-13e0dc024425',
      content: 'Hello from User1!',
    });
  }, 1000);
});

socket.on('receive_message', (msg) => {
  console.log('User1 received:', msg);
});
