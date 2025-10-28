import { MongoClient } from "mongodb";
import { initTodoRepository } from "../repositories/todoRepository";
import { initNotificationRepository } from "../repositories/notificationRepository";

const MONGODB_URI = "mongodb://localhost:27017,localhost:27018,localhost:27019/todo_app?replicaSet=rs0";
const DB_NAME = process.env.DB_NAME || "todo_app";

let client: MongoClient;

export async function connectToDatabase() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);

    // Initialize repositories
    initTodoRepository(db);
    initNotificationRepository(db);

    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
}
