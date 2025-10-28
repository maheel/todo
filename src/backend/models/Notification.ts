import { ObjectId } from "mongodb";

export interface Notification {
  _id?: ObjectId;
  message: string;
  read: boolean;
  createdAt: Date;
}

export const NOTIFICATIONS_COLLECTION = "notifications";
