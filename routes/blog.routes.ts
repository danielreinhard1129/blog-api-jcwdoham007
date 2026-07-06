import express from "express";
import {
  createBlogController,
  getBlogBySlugController,
  getBlogsController,
} from "../controllers/blog.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createBlogSchema } from "../validators/blog.validator.js";

const blogRoutes = express.Router();

blogRoutes.get("/", getBlogsController);
blogRoutes.get("/:slug", getBlogBySlugController);
blogRoutes.post(
  "/",
  verifyToken(process.env.JWT_SECRET!),
  validate(createBlogSchema),
  createBlogController,
);

export { blogRoutes };
