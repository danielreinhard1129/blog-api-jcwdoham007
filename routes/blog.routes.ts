import express from "express";
import {
  createBlogController,
  getBlogBySlugController,
  getBlogsController,
} from "../controllers/blog.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const blogRoutes = express.Router();

blogRoutes.get("/", getBlogsController);
blogRoutes.get("/:slug", getBlogBySlugController);
blogRoutes.post("/", verifyToken(process.env.JWT_SECRET!) ,createBlogController);

export { blogRoutes };
