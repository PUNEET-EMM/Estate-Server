import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import { initSocket } from "./socket.js";

import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

configDotenv();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin); 
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

initSocket(server);

const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
