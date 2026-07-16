import { NextFunction, Request, Response } from "express";
import z from "zod";
import { ApiError } from "../utils/api-error.js";

export const createTransactionSchema = z.object({
  productId: z
    .number({ message: "Product ID is required" })
    .int("Product ID must be an integer")
    .positive("Product ID must be a positive number"),
  qty: z
    .number({ message: "Quantity is required" })
    .int("Quantity must be an integer")
    .positive("Quantity must be a positive number"),
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
