import room from "../models/room.js";
import message from "../models/message.js";
import asyncHandler from "express-async-handler";

const user = { username: "admin", _id: "66aaaade75a3e1daa7f9c49c" };

export const getRooms = asyncHandler(async (req, res, next) => {
  const rooms = await room
    .find({ members: { $in: user._id } })
    .populate("members")
    .exec();
  return res.json(rooms);
});

export const getRoom = asyncHandler(async (req, res, next) => {
  const roomId = req.params.roomId;
  const roomMessages = await message.find({ room: roomId });

  return res.json(roomMessages);
});
