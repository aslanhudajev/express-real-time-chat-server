import express from "express";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import mongoose from "mongoose";

import rootRouter from "./routes/root.js";
import "dotenv/config";
import { dir, log } from "node:console";

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

app.use("/", rootRouter);

io.on("connection", (socket) => {
  console.log("User connected, connections: " + io.engine.clientsCount);

  socket.on("chat msg", (msg) => {
    io.emit("chat msg", msg);
  });

  socket.on("disconnect", () => {
    console.log("User DC, connections: " + io.engine.clientsCount);
  });
});

nodeServer.listen(process.env.PORT, () => {
  console.log(`App running on port: ${process.env.PORT}`);
  console.log(`Server URL: http://localhost:${process.env.PORT}`);
});
