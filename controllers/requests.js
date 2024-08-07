import asyncHandler from "express-async-handler";
import requestModel from "../models/request.js";
import roomModel from "../models/room.js";
import user from "../models/user.js";

export const getRequests = asyncHandler(async (req, res, next) => {
  const requests = await requestModel
    .find({ receiver: req.user._id })
    .populate("sender")
    .exec();

  return res.json(requests);
});

export const getRequestsCount = asyncHandler(async (req, res, next) => {
  const requestsCount = await requestModel
    .find({ receiver: req.user._id })
    .countDocuments()
    .exec();
  res.json(requestsCount);
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

  const newRequest = new requestModel({
    sender: sender._id,
    receiver: receiver._id,
  });

  await newRequest.save();

  res.status(200);
  return res.json({
    success: true,
    message: "Friend requestModel sent",
  });
});

export const acceptRequest = asyncHandler(async (req, res, next) => {
  const request = await requestModel
    .findOne({ _id: req.params.requestId })
    .exec();

  if (!request) {
    res.status(400);
    return res.json({
      success: false,
      message: "Bad request",
    });
  }

  if (!req.user._id.equals(request.receiver)) {
    res.status(401);
    return res.json({
      success: false,
      message: "Unauthorized",
    });
  }

  const newRoom = new roomModel({
    members: [request.sender._id, request.receiver._id],
  });
  await newRoom.save();
  await requestModel.findOneAndDelete({ _id: request._id });

  res.status(200);
  return res.json({
    success: true,
    message: "Friend request accepted",
  });
});

export const declineRequest = asyncHandler(async (req, res, next) => {
  const request = await requestModel.findOne({ _id: req.params.requestId });

  if (!request) {
    res.status(400);
    return res.json({
      success: false,
      message: "Bad request",
    });
  }

  if (!req.user._id.equals(request.receiver)) {
    res.status(401);
    return res.json({
      success: false,
      message: "Unauthorized",
    });
  }

  await requestModel.findOneAndDelete({ _id: request._id });

  res.status(200);
  return res.json({
    success: true,
    message: "Friend request declined",
  });
});
