import argon from "argon2";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { LoginSchema, RegisterSchema } from "../validators/auth.validator.js";

export const registerService = async (body: RegisterSchema) => {
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

export const loginService = async (body: LoginSchema) => {
  // 1. cek dulu emailnya ada di db atau tidak
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  // 2. kalo ga ada throw error
  if (!user) {
    throw new ApiError("Invalid credentials", 400);
  }

  // 3. cek passwordnya bener apa tidak
  const isPassMatch = await argon.verify(user.password, body.password);

  // 4. kalo ga bener throw error
  if (!isPassMatch) {
    throw new ApiError("Invalid credentials", 400);
  }

  // 5. generate access token jwt
  const payload = { id: user.id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "2h",
  });

  // 6. return login success
  const { password, ...userWithoutPassword } = user; // remove property password
  return {
    ...userWithoutPassword,
    accessToken,
  };
};
