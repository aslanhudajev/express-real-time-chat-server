import express from "express";
import * as roomsController from "../controllers/rooms.js";
const router = express.Router();

//! Add controller functions for these
//! Add controller functions for these
//! Add controller functions for these

router.post("/signin");
router.post("/signout");

router.get("/me");

router.get("/rooms", roomsController.getRooms);
router.get("/room/:roomId");
router.post("/room/:roomId/new-message");
router.post("/room/remove");

router.post("/request/send");
router.post("/request/accept");
router.post("/request/decline");

router.get("/room/:roomId/messages");

//! Add controller functions for these
//! Add controller functions for these
//! Add controller functions for these

export default router;
