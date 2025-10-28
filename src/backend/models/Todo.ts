import { ObjectId } from "mongodb";

export interface Todo {
  _id?: ObjectId;
  text: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const TODOS_COLLECTION = "todos";
