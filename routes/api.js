import * as requestsController from "../controllers/requests.js";
import * as roomsController from "../controllers/rooms.js";
import user from "../models/user.js";
import room from "../models/room.js";
import express from "express";

const router = express.Router();

//! Add controller functions for these
//! Add controller functions for these
//! Add controller functions for these

router.get("/me");

router.get("/rooms", roomsController.getRooms);
router.get("/room/:roomId", roomsController.getRoom);
router.post("/room/remove");

router.get("/requests", requestsController.getRequests);
router.post("/request/send", requestsController.sendRequest);
router.post("/request/accept");
router.post("/request/decline");

//! Add controller functions for these
//! Add controller functions for these
//! Add controller functions for these

export default router;
