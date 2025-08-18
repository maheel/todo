import { eventBus, EVENTS, type TodoCreatedPayload } from "../eventBus";
import { notificationService } from "../../services/notificationService";

export function registerTodoCreatedSubscriber() {
  eventBus.on(EVENTS.TODO_CREATED, async (payload: TodoCreatedPayload) => {
    await notificationService.notify(`New todo created: ${payload.text}`);
  });
}
