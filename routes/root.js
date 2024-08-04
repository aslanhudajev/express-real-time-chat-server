import express from "express";
import passport from "passport";
import apiRouter from "./api.js";
import authRouter from "./auth.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/api", passport.authenticate("jwt", { session: false }), apiRouter);

export default router;
