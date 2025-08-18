import { todoRepository } from "../repositories/todoRepository";
import { eventBus, EVENTS } from "../events/eventBus";

export const todoService = {
  async list() {
    return todoRepository.findAll();
  },

  async create(text: string) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
      const err: any = new Error("Text is required");
      err.status = 400;
      throw err;
    }
    const todo = await todoRepository.create({ text: trimmed });
    // Emit domain event for observers instead of directly notifying
    eventBus.emit(EVENTS.TODO_CREATED, { text: (todo as any).text });
    return todo;
  },

  async toggleCompleted(id: string) {
    const existing = await todoRepository.findById(id);
    if (!existing) {
      const err: any = new Error("Todo not found");
      err.status = 404;
      throw err;
    }
    const updated = await todoRepository.updateCompleted(id, !existing.completed);
    return updated!;
  },

  async remove(id: string) {
    const removed = await todoRepository.remove(id);
    if (!removed) {
      const err: any = new Error("Todo not found");
      err.status = 404;
      throw err;
    }
    return removed;
  },
};
