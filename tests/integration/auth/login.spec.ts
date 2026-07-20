import argon from "argon2";
import { describe, expect, it } from "vitest";
import { Role } from "../../../generated/prisma/client.js";
import { prisma } from "../../../lib/prisma.js";
import request from "supertest";
import app from "../../../app.js";

describe("POST /auth/login", () => {
  it("should login successfully", async () => {
    // Arrange
    const data = {
      name: "test",
      email: "test@mail.com",
      password: "Test123!",
      role: Role.USER,
    };
    const hashedPassword = await argon.hash(data.password);
    await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    // Act
    const response = await request(app).post("/auth/login").send({
      email: data.email,
      password: data.password,
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.email).toBe(data.email);
  });

  it("should return error when email does not exist", async () => {
    // Act
    const response = await request(app).post("/auth/login").send({
      email: "notexist@mail.com",
      password: "Test123!",
    });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return error when password is wrong", async () => {
    // Arrange
    const data = {
      name: "test",
      email: "test@mail.com",
      password: "Test123!",
      role: Role.USER,
    };
    const hashedPassword = await argon.hash(data.password);
    await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    // Act
    const response = await request(app).post("/auth/login").send({
      email: data.email,
      password: "WrongPass1!",
    });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return error when email format is invalid", async () => {
    // Act
    const response = await request(app).post("/auth/login").send({
      email: "invalid-email",
      password: "Test123!",
    });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("email: Invalid email format");
  });

  it("should return error when password is empty", async () => {
    // Act
    const response = await request(app).post("/auth/login").send({
      email: "test@mail.com",
      password: "",
    });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("password: Password is required");
  });

  it("should return error when email is missing", async () => {
    // Act
    const response = await request(app).post("/auth/login").send({
      password: "Test123!",
    });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("email: Invalid email format");
  });

  it("should return error when password is missing", async () => {
    // Act
    const response = await request(app).post("/auth/login").send({
      email: "test@mail.com",
    });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("password: Invalid input: expected string, received undefined");
  });
});
