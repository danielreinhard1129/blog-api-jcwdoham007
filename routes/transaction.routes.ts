import express from "express";
import { createTransactionController } from "../controllers/transaction.controller.js";
import { verifyRole, verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createTransactionSchema } from "../validators/transaction.validator.js";

const transactionRoutes = express.Router();

transactionRoutes.post(
  "/",
  verifyToken(process.env.JWT_SECRET!),
  verifyRole(["USER"]),
  validate(createTransactionSchema),
  createTransactionController,
);

export { transactionRoutes };
