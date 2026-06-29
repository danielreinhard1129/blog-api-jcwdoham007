import { User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import argon from "argon2";

export const registerService = async (
  body: Pick<User, "name" | "email" | "password">,
) => {
  // 1. cek dulu emailnya udah kepake atau belom
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  // 2. kalo udah kepake throw error
  if (user) {
    throw new ApiError("Email already exist", 400);
  }

  // 3. kalo belum, hash passwordnya
  const hashedPassword = await argon.hash(body.password);

  // 4. create data usernya
  await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: "USER",
    },
  });

  // 5. return success
  return {
    message: "register success",
  };
};
