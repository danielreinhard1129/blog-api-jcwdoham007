import { Request, Response } from "express";
import { getBlogsService } from "../services/blog.service.js";
import { baseQuery } from "../utils/query.js";

export const getBlogsController = async (req: Request, res: Response) => {
  const query = baseQuery(req);
  const result = await getBlogsService(query);
  res.status(200).send(result);
};
