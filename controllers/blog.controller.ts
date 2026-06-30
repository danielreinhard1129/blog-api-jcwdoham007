import { Request, Response } from "express";
import {
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
