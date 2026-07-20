import argon from "argon2";
import jwt from "jsonwebtoken";
import { sendMail } from "../lib/mail.js";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import {
  ForgotPasswordSchema,
  GoogleSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from "../validators/auth.validator.js";
import axios from "axios";
import { GoogleUserInfo } from "../types/google.js";

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

  // 5. send welcome email
  await sendMail({
    to: body.email,
    subject: `Welcome to My Blog App`,
    templateName: "welcome.hbs",
    context: {
      name: body.name,
      siteUrl: process.env.BASE_URL_FE,
    },
  });

  // 6. return success
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
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH!, {
    expiresIn: "3d",
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiredAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    },
  });

  // 6. return login success
  const { password, ...userWithoutPassword } = user; // remove property password
  return {
    user: userWithoutPassword,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const forgotPasswordService = async (body: ForgotPasswordSchema) => {
  // 1. cek dulu emailnya, udah terdaftar atau belom
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  // 2. kalo belom terdaftar return success
  if (!user) {
    return { message: "Send email success" };
  }

  // 3. generate token jwt
  const payload = { id: user.id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET_RESET!, {
    expiresIn: "15m",
  });

  // 4. kirim email reset password + token
  await sendMail({
    to: body.email,
    subject: "Reset Password",
    templateName: "reset-password.hbs",
    context: {
      name: user.name,
      resetUrl: `${process.env.BASE_URL_FE}/reset-password/${token}`,
    },
  });

  // 5. return success
  return { message: "Send email success" };
};

export const resetPasswordService = async (
  body: ResetPasswordSchema,
  userId: number,
) => {
  // 1. cara data user yang mau diganti passwordnya
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // 2. kalo tidak ketemu throw error
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  // 3. kalo ketemu, hash password baru nya
  const hashedPassword = await argon.hash(body.password);

  // 4. update data usernya dengan password baru
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // 5. return success
  return { message: "Reset password success" };
};

export const refreshService = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new ApiError("No refresh token", 400);
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: {
      user: true,
    },
  });

  if (!stored) {
    throw new ApiError("Refresh token not found", 400);
  }

  if (stored.expiredAt < new Date()) {
    throw new ApiError("Refresh token expired", 400);
  }

  const payload = {
    id: stored.user.id,
    role: stored.user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  return { accessToken: accessToken };
};

export const logoutService = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new ApiError("No refresh token", 400);
  }

  await prisma.refreshToken.delete({
    where: { token: refreshToken },
  });

  return { message: "Logout success" };
};

export const googleService = async (body: GoogleSchema) => {
  const response = await axios.get<GoogleUserInfo>(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    { headers: { Authorization: `Bearer ${body.accessToken}` } },
  );

  let user = await prisma.user.findUnique({
    where: {
      email: response.data.email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: response.data.name,
        email: response.data.email,
        password: "",
        profilePic: response.data.picture,
        role: "USER",
      },
    });
  }

  // 5. generate access token jwt
  const payload = { id: user.id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH!, {
    expiresIn: "3d",
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiredAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    },
  });

  // 6. return login success
  const { password, ...userWithoutPassword } = user; // remove property password
  return {
    user: userWithoutPassword,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};
