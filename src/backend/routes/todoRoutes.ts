import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { todoController } from "../controllers/todoController";

const router = Router();

router.get("/", asyncHandler(todoController.list));
router.post("/", asyncHandler(todoController.create));
router.patch("/:id", asyncHandler(todoController.toggle));
router.delete("/:id", asyncHandler(todoController.remove));

export default router;
