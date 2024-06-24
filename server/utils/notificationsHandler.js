let io;

function initSocket(server) {
  io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

function notificationsHandler(type, id, message, user, notifyEveryone) {
  console.log(message);
  console.log(`${user} ${message} ${type} ${id}`);

  // This will Emit a notification event to all connected clients
  io.emit("notification", { type, id, message, user, notifyEveryone });
}

module.exports = {
  notificationsHandler,
  initSocket,
};
