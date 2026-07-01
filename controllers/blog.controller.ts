import { Request, Response } from "express";
import {
  createBlogService,
  getBlogBySlugService,
  getBlogsService,
} from "../services/blog.service.js";
import { baseQuery } from "../utils/query.js";

export const getBlogsController = async (req: Request, res: Response) => {
  const query = baseQuery(req);
  const result = await getBlogsService(query);
  res.status(200).send(result);
};

export const getBlogBySlugController = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await getBlogBySlugService(slug);
  res.status(200).send(result);
};

export const createBlogController = async (req: Request, res: Response) => {
  const userId = res.locals.user.id;
  const result = await createBlogService(req.body, userId);
  res.status(200).send(result);
};
