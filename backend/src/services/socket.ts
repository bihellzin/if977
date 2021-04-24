import { Server, Socket } from 'socket.io';

export function createSocket(server: Express.Application, options = {}) {
  const io = new Server(server, options);

  io.on('connection', (socket: Socket) => {
    console.log(`Client ${socket.id} connected!`);

    socket.on('join-room', async (roomId: number) => {
      socket.join(`${roomId}`);
      console.log(`Client ${socket.id} join room ${roomId}!`);
      socket.emit('join-room', true);
      socket.emit('messages');
      socket.emit('plays');
    });

    socket.on('leave-room', (roomId: number) => {
      socket.leave(`${roomId}`);
      console.log(`Client ${socket.id} leave room ${roomId}!`);
      socket.emit('join-room', true);
    });

    socket.on('disconnect', () => {
      console.log(`Client ${socket.id} disconected!`);
      socket.emit('join-room', true);
    });
  });

  return io;
}
