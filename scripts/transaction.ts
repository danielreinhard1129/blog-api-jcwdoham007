import cron from "node-cron";
import { prisma } from "../lib/prisma.js";

export const expiredTransactionCron = () => {
  cron.schedule("*/5 * * * *", async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const expiredTransactions = await prisma.transaction.findMany({
      where: {
        status: "WAITING_FOR_PAYMENT",
        createdAt: { lte: oneHourAgo },
      },
    });

    for (const tx of expiredTransactions) {
      await prisma.$transaction(async (prismaTx) => {
        await prismaTx.transaction.update({
          where: { id: tx.id },
          data: { status: "EXPIRED" },
        });

        await prismaTx.product.update({
          where: { id: tx.productId },
          data: { stock: { increment: tx.qty } },
        });
      });
    }
  });
};
