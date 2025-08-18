import { TodoModel } from "../models/Todo";

export const todoRepository = {
  findAll: () => TodoModel.find().sort({ createdAt: -1 }).lean(),
  findById: (id: string) => TodoModel.findById(id).lean(),
  create: (payload: { text: string }) => new TodoModel(payload).save(),
  updateCompleted: (id: string, completed: boolean) =>
    TodoModel.findByIdAndUpdate(
      id,
      { $set: { completed } },
      { new: true }
    ).lean(),
  remove: (id: string) => TodoModel.findByIdAndDelete(id).lean(),
};
