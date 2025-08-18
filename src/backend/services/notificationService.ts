import { notificationRepository } from "../repositories/notificationRepository";
import { getIO } from "../sockets/io";

export const notificationService = {
  async list() {
    return notificationRepository.findAll();
  },

  async notify(message: string) {
    const notification = await notificationRepository.create({ message });
    try {
      getIO().emit("notification", {
        _id: (notification as any)._id,
        message: (notification as any).message,
        read: (notification as any).read,
        createdAt: (notification as any).createdAt,
      });
    } catch {
      // ignore if IO not yet initialized (e.g., during tests)
    }
    return notification;
  },

  async markAllAsRead() {
    await notificationRepository.markAllAsRead();
    return { success: true };
  },
};
