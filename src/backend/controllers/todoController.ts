import type { Request, Response } from "express";
import { todoService } from "../services/todoService";

export const todoController = {
  list: async (_req: Request, res: Response) => {
    const todos = await todoService.list();
    res.json(todos);
  },

  create: async (req: Request, res: Response) => {
    const { text } = req.body ?? {};
    const todo = await todoService.create(text);
    res.status(201).json(todo);
  },

  toggle: async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await todoService.toggleCompleted(id);
    res.json(updated);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = req.params;
    await todoService.remove(id);
    res.status(204).send();
  },
};
