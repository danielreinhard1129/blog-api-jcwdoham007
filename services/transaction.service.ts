import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import type { CreateTransactionSchema } from "../validators/transaction.validator.js";

export const createTransactionService = async (
  body: CreateTransactionSchema,
  userId: number,
) => {
  const { productId, qty } = body;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  if (product.stock < qty) {
    throw new ApiError("Insufficient stock", 400);
  }

  const price = product.price;

  await prisma.$transaction(async (tx) => {
    await tx.transaction.create({
      data: { userId, productId, qty, price },
    });

    await tx.product.update({
      where: { id: productId },
      data: { stock: { decrement: qty } },
    });
  });

  return { message: "Transaction created successfully" };
};

const uploadPaymentService = () => {};

const acceptOrRejectTransactionService = () => {};
