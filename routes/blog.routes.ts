import express from "express";
import { getBlogsController } from "../controllers/blog.controller.js";

const blogRoutes = express.Router();

blogRoutes.get("/", getBlogsController);

export { blogRoutes };
