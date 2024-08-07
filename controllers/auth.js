import * as authMiddleWare from "../middlewares/auth.js";
import asyncHandler from "express-async-handler";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";

export const login = asyncHandler(async (req, res, nex) => {
  const user = await userModel.findOne({ username: req.body.username });

  if (!user) {
    res.status(400);
    return res.json({
      success: false,
      message: "Username or password incorrect",
    });
  }

  const match = await bcrypt.compare(req.body.password, user.password);
  //const match = req.body.password === user.password;
  if (!match) {
    res.status(400);
    return res.json({
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
  return res.json({
    success: true,
    message: "Logged in",
    token: "Bearer " + token,
  });
});

export const register = [
  authMiddleWare.validateFormInput,
  authMiddleWare.registerUser,
  asyncHandler(async (req, res, next) => {
    if (res.locals.validationErrors) {
      res.status(400);
      res.json({
        success: false,
        body: req.body,
        errors: res.locals.validationErrors.array(),
      });
    } else {
      await authMiddleWare.registerUserCommit(res);
      res.status(200);
      return res.json({
        success: true,
        message: "User registered",
        user: res.locals.user,
      });
    }
  }),
];
