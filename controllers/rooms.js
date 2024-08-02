import room from "../models/room.js";
import asyncHandler from "express-async-handler";

const user = { username: "admin", _id: "66aaaade75a3e1daa7f9c49c" };

export const getRooms = asyncHandler(async (req, res, next) => {
  const rooms = await room.find({ members: { $in: user._id } });
  return res.json(rooms);
});
