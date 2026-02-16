const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: 'http://localhost:5173', credentials: true },
  });


  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token || typeof token !== "string") {
        console.error("❌ Connection rejected: Token is not a string.");
        return next(new Error("Unauthorized: Invalid token format"));
      }

      // const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const decoded = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluMSIsImlhdCI6MTc3MDkxMzY3MywiZXhwIjoxNzcwOTQyNDczfQ.96MNNzErFvJQ1BklMMpXg2dCSErqBEhDS0qcPSMSkPU', process.env.Secrete_KEY);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error("❌ Auth Error:", err.message);
      next(new Error("Unauthorized"));
    }
  });

  // 2. Event Handler
  io.on("connection", (socket) => {
    console.log(`✅ Connected: ${socket.user.username} (Socket: ${socket.id})`);

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  return io;
};

module.exports = { initSocket };