import express from "express";
import {
  getBlogBySlugController,
  getBlogsController,
} from "../controllers/blog.controller.js";

const blogRoutes = express.Router();

blogRoutes.get("/", getBlogsController);
blogRoutes.get("/:slug", getBlogBySlugController);

export { blogRoutes };
