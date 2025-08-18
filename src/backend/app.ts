import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { config } from "./config/env";

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());

  app.use("/api/todos", todoRoutes);
  app.use("/api/notifications", notificationRoutes);

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use(errorHandler);
  return app;
}
