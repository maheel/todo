import { NotificationModel } from "../models/Notification";

export const notificationRepository = {
  findAll: () => NotificationModel.find().sort({ createdAt: -1 }).lean(),
  create: (payload: { message: string }) => new NotificationModel(payload).save(),
  markAllAsRead: () =>
    NotificationModel.updateMany({ read: false }, { $set: { read: true } }),
};
