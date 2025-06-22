import { Server } from "socket.io";

let onlineUsers = [];

const addUser = (userId, socketId) => {
  const exists = onlineUsers.find((u) => u.userId === userId);
  if (!exists) onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((u) => u.userId === userId);
};

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    socket.on("newUser", (userId) => {
      addUser(userId, socket.id);
      console.log("Online users:", onlineUsers);
    });

    socket.on("sendMessage", ({ receiverId, data }) => {
      const receiver = getUser(receiverId);
      if (receiver) {
        io.to(receiver.socketId).emit("getMessage", data);
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log(" Socket disconnected:", socket.id);
    });
  });
};
