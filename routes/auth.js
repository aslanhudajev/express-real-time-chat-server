import express from "express";
import passport from "passport";
import * as authController from "../controllers/auth.js";

const router = express.Router();

router.get(
  "/authenticate",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.status(200);
    res.send(req.user);
  },
);

router.post("/login", authController.login);
router.post("/logout");

export default router;
