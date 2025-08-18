import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { notificationController } from "../controllers/notificationController";

const router = Router();

router.get("/", asyncHandler(notificationController.list));
router.patch("/markAllAsRead", asyncHandler(notificationController.markAllAsRead));

export default router;
