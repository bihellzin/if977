const { Server } = require("socket.io");
const { v4: uuid } = require("uuid");

const io = new Server(server);

io.on("connection", (socket) => {
  const id = uuid();
  console.log(`Client ${id} connected!`);

  io.on("message", (data) => {
    console.log(`Client ${id} send:`, data);
  });

  socket.on("close", () => console.log(`Client ${id} disconected!`));
});

setInterval(() => io.emit("time", new Date().toTimeString()), 1000);

module.exports = io;
