export const config = {
  port: Number(process.env.PORT) || 4000,
  mongoUri:
    process.env.MONGO_URI ||
    "mongodb://root:example@localhost:27017/todos?authSource=admin",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  // Legacy URL key retained but not used anymore
  eventBridgeUrl: process.env.EVENT_BRIDGE_URL || "",
  // SDK-based configuration
  eventBridgeBusName: process.env.EVENT_BRIDGE_BUS_NAME || "",
  eventBridgeRegion: process.env.EVENT_BRIDGE_REGION || process.env.AWS_REGION || "",
  eventBridgeSource: process.env.EVENT_BRIDGE_SOURCE || "app.backend",
};
