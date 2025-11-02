import {Collection, Db, ClientSession, ObjectId} from 'mongodb';
import { OutboxEvent, OUTBOX_COLLECTION } from "../models/Outbox";

let outboxCollection: Collection<OutboxEvent>;

export const initOutboxRepository = (db: Db) => {
  outboxCollection = db.collection<OutboxEvent>(OUTBOX_COLLECTION);
};

export const outboxRepository = {
  create: async (event: Omit<OutboxEvent, '_id'>, session?: ClientSession) => {
    const result = await outboxCollection.insertOne(event as OutboxEvent, { session });
    return { ...event, _id: result.insertedId };
  },

  findPendingEvents: async (limit: number = 100) => {
    return outboxCollection
      .find({ status: 'PENDING' })
      .sort({ createdAt: 1 })
      .limit(limit)
      .toArray();
  },

  markAsProcessed: async (eventId: string) => {
    return outboxCollection.updateOne(
      { _id: new ObjectId(eventId) },
      { 
        $set: { 
          status: 'PROCESSED', 
          processedAt: new Date() 
        } 
      }
    );
  },

  markAsFailed: async (eventId: string, error: string) => {
    return outboxCollection.updateOne(
      { _id: new ObjectId(eventId) },
      { 
        $set: { 
          status: 'FAILED', 
          error,
          processedAt: new Date() 
        },
        $inc: { retryCount: 1 }
      }
    );
  }
};
