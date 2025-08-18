import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const TodoModel = model("Todo", todoSchema);
