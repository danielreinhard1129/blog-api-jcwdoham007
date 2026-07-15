import express from "express";
import {
  createUserController,
  deleteUserController,
  getUserController,
  getUsersController,
  samplesController,
  updateUserController,
} from "../controllers/user.controller.js";
import { createUserValidator } from "../validators/user.validator.js";
import { verifyRole, verifyToken } from "../middlewares/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.get(
  "/",
  verifyToken(process.env.JWT_SECRET!),
  verifyRole(["SUPER_ADMIN", "ADMIN"]),
  getUsersController,
);

userRoutes.get("/samples", samplesController);

userRoutes.get("/:id", getUserController);
userRoutes.post("/", createUserValidator, createUserController);
userRoutes.patch("/:id", updateUserController);
userRoutes.delete("/:id", deleteUserController);

export { userRoutes };
