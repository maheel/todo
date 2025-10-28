import { Collection, Db } from "mongodb";
import { Notification, NOTIFICATIONS_COLLECTION } from "../models/Notification";

let notificationsCollection: Collection<Notification>;

export const initNotificationRepository = (db: Db) => {
  notificationsCollection = db.collection<Notification>(NOTIFICATIONS_COLLECTION);
};

export const notificationRepository = {
  findAll: async () => {
    return notificationsCollection.find().sort({ createdAt: -1 }).toArray();
  },

  create: async (payload: { message: string }) => {
    const newNotification: Notification = {
      message: payload.message,
      read: false,
      createdAt: new Date()
    };

    const result = await notificationsCollection.insertOne(newNotification);
    return { ...newNotification, _id: result.insertedId };
  },

  markAllAsRead: async () => {
    const result = await notificationsCollection.updateMany(
      { read: false },
      { $set: { read: true } }
    );

    return result;
  }
};
