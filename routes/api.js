import express from "express";
const router = express.Router();

//! Add controller functions for these
//! Add controller functions for these
//! Add controller functions for these

router.post("/signin");
router.post("/signout");

router.get("/me");

router.get("/friends");
router.get("/friend/:userId");
router.post("/friend/add");
router.post("/friend/add/accept");
router.post("/friend/add/decline");
router.post("/friend/remove");

router.get("/room/:roomId/messages");
router.post("/room/:roomId/message/new");

//! Add controller functions for these
//! Add controller functions for these
//! Add controller functions for these

export default router;
