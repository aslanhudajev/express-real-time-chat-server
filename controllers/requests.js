import asyncHandler from "express-async-handler";
import request from "../models/request.js";
import user from "../models/user.js";

export const getRequests = asyncHandler(async (req, res, next) => {
  const requests = await request
    .find({ receiver: req.user._id })
    .populate("sender")
    .exec();

  return res.json(requests);
});

export const sendRequest = asyncHandler(async (req, res, next) => {
  const receiver = await user.findOne({ username: req.body.receiver });
  const sender = req.user;

  if (!receiver) {
    res.status(400);
    return res.json({
      success: false,
      message: "User does not exist",
    });
  }

  const newRequest = new request({
    sender: sender._id,
    receiver: receiver._id,
  });

  await newRequest.save();

  res.status(200);
  return res.json({
    success: true,
    message: "Friend request sent",
  });
});

export const acceptRequest = asyncHandler(async (req, res, next) => {
  console.log("accepted");
  return next();
});

export const declineRequest = asyncHandler(async (req, res, next) => {
  console.log("dec");
  return next();
});
