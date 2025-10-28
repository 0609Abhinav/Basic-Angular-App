import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getProfile);
// router.put("/update", verifyToken, updateProfile);
router.patch("/update", verifyToken, updateProfile);


export default router;
