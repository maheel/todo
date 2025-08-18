import { eventBus, EVENTS } from "../eventBus";
import { sendEvent } from "../../integrations/eventBridge";

export function registerEventBridgeForwarder() {
  eventBus.on(EVENTS.TODO_CREATED, async (payload) => {
    try {
      await sendEvent(EVENTS.TODO_CREATED, payload);
    } catch {
      // Silently ignore forwarding errors to not impact core flow
    }
  });
}
