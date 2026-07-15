import { Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  getUserService,
  getUsersService,
  samplesService,
  updateUserService,
} from "../services/user.service.js";
import { baseQuery } from "../utils/query.js";

export const getUsersController = async (req: Request, res: Response) => {
  const query = baseQuery(req);
  const result = await getUsersService(query);
  res.status(200).send(result);
};

export const getUserController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await getUserService(id);
  res.status(200).send(result);
};

export const createUserController = async (req: Request, res: Response) => {
  const result = await createUserService(req.body);
  res.status(200).send(result);
};

export const updateUserController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await updateUserService(id, req.body);
  res.status(200).send(result);
};

export const deleteUserController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await deleteUserService(id);
  res.status(200).send(result);
};

export const samplesController = async (req: Request, res: Response) => {
  const result = await samplesService();
  res.status(200).send(result);
};
