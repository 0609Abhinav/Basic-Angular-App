import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../validators/profileValidator.js";

const router = express.Router();

router.get("/", verifyToken, getProfile);
router.patch("/update", verifyToken, validate(updateProfileSchema), updateProfile);

export default router;
