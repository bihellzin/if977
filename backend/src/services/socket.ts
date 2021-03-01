import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';

interface Player {
  id: string;
  roomId?: string;
}

interface Message {
  id: string;
  from: string;
  message: string;
}

interface Room {
  id: string;
  messages: Message[];
  players: { [key: string]: Player };
}

export function createSocket(server: Express.Application, options = {}) {
  const io = new Server(server, options);

  const rooms: { [key: string]: Room } = {
    test: {
      id: uuid(),
      messages: [],
      players: {},
    },
  };

  io.on('connection', socket => {
    const player: Player = { id: socket.id, roomId: undefined };

    console.log(`Client ${player.id} connected!`);

    socket.on('join-room', (roomId: string) => {
      console.log(`Client ${player.id} join room ${roomId}!`);
      if (roomId in rooms) {
        player.roomId = roomId;
        rooms[roomId].players[player.id] = player;
        socket.emit('join-room', rooms[player.roomId].messages);
      } else {
        socket.emit('join-room', null);
      }
    });

    socket.on('chat-message', (data: string) => {
      console.log(`Client ${player.id} send:`, data, player);
      if (player.roomId && player.roomId in rooms) {
        rooms[player.roomId].messages.push({
          id: uuid(),
          from: player.id,
          message: data,
        });
        // Send self
        socket.emit('chat-message', rooms[player.roomId].messages);
        // Send to others
        Object.keys(rooms[player.roomId].players).map(id => {
          if (player.roomId) {
            socket.to(id).emit('chat-message', rooms[player.roomId].messages);
          }
        });
      }
    });

    socket.on('disconnecting', (reason: any) => {
      if (player.roomId && player.roomId in rooms) {
        rooms[player.roomId].messages.push({
          id: uuid(),
          from: player.id,
          message: 'has left!',
        });
        Object.keys(rooms[player.roomId].players).map(id => {
          if (player.roomId) {
            socket.to(id).emit('chat-message', rooms[player.roomId].messages);
            socket.to(id).emit('player-left', player.id);
          }
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client ${player.id} disconected!`);
    });
  });

  setInterval(() => io.emit('server-time', new Date().toISOString()), 1000);

  return io;
}
