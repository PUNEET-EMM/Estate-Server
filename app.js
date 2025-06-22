import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import { initSocket } from "./socket.js";

configDotenv();

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL?.replace(/\/+$/, "");

app.use(cors({
  origin: (origin, callback) => {
    const cleaned = origin?.replace(/\/+$/, "");
    if (!origin || cleaned === CLIENT_URL) {
      callback(null, true);
    } else {
      console.log("Blocked CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

initSocket(server);

const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
