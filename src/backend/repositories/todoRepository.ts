import { Collection, Db, ObjectId } from "mongodb";
import { Todo, TODOS_COLLECTION } from "../models/Todo";
import { getMongoClient } from "../utils/database";
import { outboxRepository } from "./outboxRepository";

let todosCollection: Collection<Todo>;

export const initTodoRepository = (db: Db) => {
  todosCollection = db.collection<Todo>(TODOS_COLLECTION);
};

export const todoRepository = {
  findAll: async () => {
    return todosCollection.find().sort({ createdAt: -1 }).toArray();
  },

  findById: async (id: string) => {
    return todosCollection.findOne({ _id: new ObjectId(id) });
  },

  create: async (payload: { text: string }) => {
    const client = getMongoClient();
    const session = client.startSession();

    try {
      let createdTodo: Todo & { _id: ObjectId };

      await session.withTransaction(async () => {
        const now = new Date();
        const newTodo: Todo = {
          text: payload.text,
          completed: false,
          createdAt: now,
          updatedAt: now
        };

        const result = await todosCollection.insertOne(newTodo, { session });
        createdTodo = { ...newTodo, _id: result.insertedId };

        // Create outbox event for todo creation
        const outboxEvent = {
          eventType: 'TodoCreated',
          aggregateType: 'Todo',
          aggregateId: result.insertedId.toString(),
          payload: {
            text: newTodo.text,
            completed: newTodo.completed,
            createdAt: newTodo.createdAt,
            updatedAt: newTodo.updatedAt
          },
          status: 'PENDING' as const,
          createdAt: now,
          retryCount: 0
        };

        await outboxRepository.create(outboxEvent, session);
      });

      return createdTodo!;
    } finally {
      await session.endSession();
    }
  },

  updateCompleted: async (id: string, completed: boolean) => {
    const result = await todosCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { completed, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    // @ts-ignore
    return result.value;
  },

  remove: async (id: string) => {
    const result = await todosCollection.findOneAndDelete({ _id: new ObjectId(id) });
    // @ts-ignore
    return result.value;
  }
};
