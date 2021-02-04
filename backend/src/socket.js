const { Server } = require("socket.io");
const { v4: uuid } = require("uuid");

function createSocket(server, options = {}) {
  const io = new Server(server, options);

  const rooms = {
    test: {
      id: uuid(),
      messages: [],
      players: {},
    },
  };

  io.on("connection", (socket) => {
    const player = { id: socket.id, roomId: null };

    console.log(`Client ${player.id} connected!`);

    socket.on("join-room", (roomId) => {
      console.log(`Client ${player.id} join room ${roomId}!`);
      if (roomId in rooms) {
        player.roomId = roomId;
        rooms[roomId].players[player.id] = player;
        socket.emit("join-room", true);
      } else {
        socket.emit("join-room", false);
      }
    });

    socket.on("chat-message", (data) => {
      console.log(`Client ${player.id} send:`, data, player);
      if (player.roomId in rooms) {
        rooms[player.roomId].messages.push({
          id: uuid(),
          from: player.id,
          message: data,
        });
        // Send self
        socket.emit("chat-message", rooms[player.roomId].messages);
        // Send to others
        Object.keys(rooms[player.roomId].players).map((id) => {
          socket.to(id).emit("chat-message", rooms[player.roomId].messages);
        });
      }
    });

    socket.on("disconnecting", (reason) => {
      if (player.roomId in rooms) {
        Object.keys(rooms[player.roomId].players).map((id) => {
          rooms[player.roomId].messages.push({
            id: uuid(),
            from: player.id,
            message: player.id + " has left!",
          });
          socket.to(id).emit("chat-message", rooms[player.roomId].messages);
          socket.to(id).emit("player-left", player.id);
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client ${player.id} disconected!`);
    });
  });

  setInterval(() => io.emit("server-time", new Date().toISOString()), 1000);
  return io;
}

module.exports = createSocket;
