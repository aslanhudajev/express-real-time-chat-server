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

router.get("/room/:roomId", roomsController.getRoom);
router.get("/rooms", roomsController.getRooms);
router.post("/room/remove");

router.post("/request/decline/:requestId", requestsController.declineRequest);
router.post("/request/accept/:requestId", requestsController.acceptRequest);
router.post("/request/send", requestsController.sendRequest);
router.get("/requests/count", requestsController.getRequestsCount);
router.get("/requests", requestsController.getRequests);

//! Add controller functions for these
//! Add controller functions for these
//! Add controller functions for these

export default router;
