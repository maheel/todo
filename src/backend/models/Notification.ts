import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const NotificationModel = model("Notification", notificationSchema);
