import { Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rootRouter from "./routes/root.js";
import messageModel from "./models/message.js";
import "dotenv/config";

const EVENT_NEW_MSG = "NEW_MSG";

await mongoose
  .connect(process.env.MDB, {
    dbName: "express-real-time-chat",
  })
  .then(() => {
    console.log("MDG connection succefull");
  })
  .catch((error) => {
    console.log("MDB connection failed:");
    console.log(error);
  });

const app = express();
const nodeServer = createServer(app);
const io = new Server(nodeServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(cors());
app.use("/", rootRouter);

io.on("connection", (socket) => {
  console.log(
    `User connected to room ${socket.handshake.query.roomId}, connections: ${io.engine.clientsCount}`,
  );
  const roomId = socket.handshake.query.roomId;
  socket.join(roomId);

  socket.on(EVENT_NEW_MSG, (message) => {
    const msg = new messageModel({ ...message });
    console.log(msg);
    io.emit(EVENT_NEW_MSG, msg);
  });

  socket.on("disconnect", () => {
    console.log(`User DC, connections: ${io.engine.clientsCount}`);
  });
});

nodeServer.listen(process.env.PORT, () => {
  console.log(`App running on port: ${process.env.PORT}`);
  console.log(`Server URL: http://localhost:${process.env.PORT}`);
});
