import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";

export const validateFormInput = [
  body("username", "Username can not be empty")
    .trim()
    .toLowerCase()
    .escape()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username has to be between 3 and 30 character.")
    .custom(async (value) => {
      const usernameInUse = await userModel.findOne({ username: value }).exec();
      if (usernameInUse) {
        throw new Error("Username is already in use");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("A password is required")
    .isLength({ min: 8 })
    .withMessage("Password has to be at least 8 characters")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      returnScore: false,
    })
    .withMessage("Password is not strong enough"),
  body("passwordConfirm", "Passwords confirmation can not be empty").custom(
    (value, { req }) => {
      if (value !== req.body.password) {
        console.log("val: " + value);
        console.log(req.body.password);

        throw new Error("Password confirmation does not match password");
      }
      return true;
    },
  ),

  (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      if (!res.locals) {
        res.locals = {
          validationErrors,
        };
      } else {
        res.locals.validationErrors = validationErrors;
      }
    }

    return next();
  },
];

export const registerUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (error, hash) => {
    if (error) {
      return next(error);
    }

    const user = new userModel({
      ...req.body,
      password: hash,
    });

    delete user["password-confirm"];

    if (!res.locals) {
      res.locals = {
        user,
      };
    } else {
      res.locals.user = user;
    }

    return next();
  });
};

export const registerUserCommit = asyncHandler(async (res) => {
  await res.locals.user.save();
});
