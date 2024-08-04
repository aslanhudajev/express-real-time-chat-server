import "dotenv/config";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import asyncHandler from "express-async-handler";

export const login = asyncHandler(async (req, res, nex) => {
  const user = await userModel.findOne({ username: req.body.username });

  if (!user) {
    res.status(400);
    return res.send({
      success: false,
      message: "Username or password incorrect",
    });
  }

  //const match = await bcrypt.compare(req.body.password, user.password);
  const match = req.body.password === user.password;
  if (!match) {
    res.status(400);
    return res.send({
      success: false,
      message: "Username or password incorrect",
    });
  }

  const payload = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });

  res.status(200);
  return res.send({
    success: true,
    message: "Logged in",
    token: "Bearer " + token,
  });
});
