import { config } from "../config/env";

let client: any | null = null;

async function getClient(region: string) {
  if (!client) {
    const mod: any = await import("@aws-sdk/client-eventbridge");
    client = new mod.EventBridgeClient({ region });
  }
  return client;
}

/**
 * Sends a single event to AWS EventBridge using the SDK.
 * No-ops if required configuration (region or bus name) is missing.
 */
export async function sendEvent(type: string, detail: unknown): Promise<void> {
  const busName = config.eventBridgeBusName || process.env.EVENT_BRIDGE_BUS_NAME || "";
  const region = config.eventBridgeRegion || process.env.AWS_REGION || "";
  const source = config.eventBridgeSource || "app.backend";

  if (!busName || !region) {
    return;
  }

  const entry = {
    EventBusName: busName,
    DetailType: type,
    Source: source,
    Detail: JSON.stringify(detail ?? {}),
    Time: new Date(),
  };

  try {
    const mod: any = await import("@aws-sdk/client-eventbridge");
    const eb = await getClient(region);
    await eb.send(new mod.PutEventsCommand({ Entries: [entry] }));
  } catch {
    // Swallow errors to avoid impacting core app flow
  }
}
