import "dotenv/config";
import { Server } from "socket.io";
import { createServer } from "node:http";
import express, { urlencoded } from "express";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import cors from "cors";
import passport from "passport";
import mongoose from "mongoose";
import rootRouter from "./routes/root.js";

import userModel from "./models/user.js";
import messageModel from "./models/message.js";

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

//Passport auth setup
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

passport.use(
  new JwtStrategy(jwtOpts, async (jwt_payload, done) => {
    const user = await userModel.findOne(
      { _id: jwt_payload.id },
      "username _id",
    );

    if (!user) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  }),
);

//Socket IO setup
const nodeServer = createServer(app);
const io = new Server(nodeServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(cors());
app.use(passport.initialize());
app.use(express.static("./public"));
app.use(urlencoded({ extended: false }));
app.use(express.json());

app.use("/", rootRouter);

io.on("connection", (socket) => {
  console.log(
    `User connected to room ${socket.handshake.query.roomId}, connections: ${io.engine.clientsCount}`,
  );
  const roomId = socket.handshake.query.roomId;
  socket.join(roomId);

  socket.on(process.env.SOCKET_EVENT_NEW_MSG, async (message) => {
    let msg = new messageModel({ ...message });
    await msg.save();
    msg = await messageModel.findOne({ _id: msg._id }).populate("user");

    io.emit(process.env.SOCKET_EVENT_NEW_MSG, msg);
  });

  socket.on("disconnect", () => {
    console.log(`User DC, connections: ${io.engine.clientsCount}`);
  });
});

nodeServer.listen(process.env.PORT, () => {
  console.log(`App running on port: ${process.env.PORT}`);
  console.log(`Server URL: http://localhost:${process.env.PORT}`);
});
