import http from "http";
import { createApp } from "./app";
import { connectToDatabase, closeDatabaseConnection } from "./utils/database";
import { initIO } from "./sockets/io";
import { notificationService } from "./services/notificationService";
import { config } from "./config/env";
import { registerTodoCreatedSubscriber } from "./events/subscribers/todoCreatedSubscriber";
import { registerEventBridgeForwarder } from "./events/subscribers/eventBridgeForwarder";

async function bootstrap() {
  await connectToDatabase();

  registerTodoCreatedSubscriber();
  registerEventBridgeForwarder();

  const app = createApp();
  const server = http.createServer(app);

  const io = initIO(server);

  io.on("connection", async (socket) => {
    // eslint-disable-next-line no-console
    console.log("Socket connected:", socket.id);
    const notifications = await notificationService.list();
    socket.emit("notifications", notifications);

    socket.on("disconnect", () => {
      // eslint-disable-next-line no-console
      console.log("Socket disconnected:", socket.id);
    });
  });

  server.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${config.port}`);
  });

  process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await closeDatabaseConnection();
    process.exit(0);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error during bootstrap:", err);
  process.exit(1);
});
