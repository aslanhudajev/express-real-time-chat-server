import room from "../models/room.js";
import message from "../models/message.js";
import asyncHandler from "express-async-handler";

export const getRooms = asyncHandler(async (req, res, next) => {
  const rooms = await room
    .find({ members: { $in: req.user._id } })
    .populate("members")
    .exec();
  return res.json(rooms);
});

export const getRoom = asyncHandler(async (req, res, next) => {
  const roomId = req.params.roomId;
  const roomMessages = await message
    .find({ room: roomId })
    .populate("user")
    .exec();

  return res.json(roomMessages);
});
