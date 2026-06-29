import express from "express";
import { registerController } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerController);

export { authRoutes };
