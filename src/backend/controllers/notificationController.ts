import type { Request, Response } from "express";
import { notificationService } from "../services/notificationService";

export const notificationController = {
  list: async (_req: Request, res: Response) => {
    const notifications = await notificationService.list();
    res.json(notifications);
  },

  markAllAsRead: async (_req: Request, res: Response) => {
    const result = await notificationService.markAllAsRead();
    res.json(result);
  },
};
