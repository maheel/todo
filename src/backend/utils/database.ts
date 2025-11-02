import { MongoClient } from "mongodb";
import { initTodoRepository } from "../repositories/todoRepository";
import { initNotificationRepository } from "../repositories/notificationRepository";
import { initOutboxRepository } from "../repositories/outboxRepository";
import { initOutboxStream, closeOutboxStream } from "../services/outboxStreamService";

const MONGODB_URI = "mongodb://localhost:27017,localhost:27018,localhost:27019/todo_app?replicaSet=rs0";
const DB_NAME = process.env.DB_NAME || "todo_app";

let client: MongoClient;

export async function connectToDatabase() {
  try {

    console.log("📡 MONGODB_URI environment variable:", MONGODB_URI);
    // console.log("🔗 Final connection URI:", uri);
    // console.log("💾 DB_NAME:", process.env.DB_NAME || "todo_app");

    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);

    // Initialize repositories
    initTodoRepository(db);
    initNotificationRepository(db);
    initOutboxRepository(db);

    // Initialize outbox change stream for real-time event monitoring
    initOutboxStream(db);

    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export function getMongoClient(): MongoClient {
  if (!client) {
    throw new Error("MongoDB client not initialized. Call connectToDatabase first.");
  }
  return client;
}

export async function closeDatabaseConnection() {
  // Close change stream first
  await closeOutboxStream();

  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
}
