import { EventEmitter } from "events";

export type TodoCreatedPayload = { text: string };

export const eventBus = new EventEmitter();

// Event name constants (optional)
export const EVENTS = {
  TODO_CREATED: "todo.created",
} as const;

export type EventMap = {
  [EVENTS.TODO_CREATED]: TodoCreatedPayload;
};
