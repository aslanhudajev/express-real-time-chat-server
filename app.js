import "dotenv/config";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import rootRouter from "./routes/root.js";

import messageModel from "./models/message.js";

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

  socket.on(EVENT_NEW_MSG, async (message) => {
    const msg = new messageModel({ ...message });
    await msg.save();
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
