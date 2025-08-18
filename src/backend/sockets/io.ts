import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { config } from "../config/env";

let io: Server | null = null;

export function initIO(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: config.corsOrigin,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }
  return io;
}
