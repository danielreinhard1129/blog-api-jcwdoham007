import { describe, expect, it } from "vitest";
import { Role } from "../../../generated/prisma/client.js";
import { prisma } from "../../../lib/prisma.js";
import request from "supertest";
import app from "../../../app.js";

describe("POST /auth/register", () => {
  it("should register successfully", async () => {
    const data = {
      name: "test",
      email: "test@mail.com",
      password: "Test123!",
      role: Role.USER,
    };

    const response = await request(app).post("/auth/register").send(data);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("register success");
  });

  it("should return error when name is missing", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "test@mail.com",
      password: "Test123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("name: Invalid input: expected string, received undefined");
  });

  it("should return error when name is empty", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "",
      email: "test@mail.com",
      password: "Test123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("name: Name is required");
  });

  it("should return error when email format is invalid", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "test",
      email: "invalid-email",
      password: "Test123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("email: Invalid email format");
  });

  it("should return error when email is missing", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "test",
      password: "Test123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("email: Invalid email format");
  });

  it("should return error when password is too short", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "test",
      email: "test@mail.com",
      password: "Ab1!",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "password: Password must be at least 6 characters",
    );
  });

  it("should return error when password has no uppercase letter", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "test",
      email: "test@mail.com",
      password: "test123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "password: Password must contain at least one uppercase letter",
    );
  });

  it("should return error when password has no lowercase letter", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "test",
      email: "test@mail.com",
      password: "TEST123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "password: Password must contain at least one lowercase letter",
    );
  });

  it("should return error when password has no number", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "test",
      email: "test@mail.com",
      password: "TestTest!",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "password: Password must contain at least one number",
    );
  });

  it("should return error when password has no special character", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "test",
      email: "test@mail.com",
      password: "Test1234",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "password: Password must contain at least one special character",
    );
  });

  it("should return error when password is missing", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "test",
      email: "test@mail.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "password: Invalid input: expected string, received undefined",
    );
  });

  it("should return error when email already exists", async () => {
    const data = {
      name: "test",
      email: "duplicate@mail.com",
      password: "Test123!",
    };

    await request(app).post("/auth/register").send(data);
    const response = await request(app).post("/auth/register").send(data);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email already exist");
  });
});
