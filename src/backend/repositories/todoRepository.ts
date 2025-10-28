import { Collection, Db, ObjectId } from "mongodb";
import { Todo, TODOS_COLLECTION } from "../models/Todo";

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
    const now = new Date();
    const newTodo: Todo = {
      text: payload.text,
      completed: false,
      createdAt: now,
      updatedAt: now
    };

    const result = await todosCollection.insertOne(newTodo);
    return { ...newTodo, _id: result.insertedId };
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
