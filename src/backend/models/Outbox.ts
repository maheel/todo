import { ObjectId } from "mongodb";

export interface OutboxEvent {
  _id?: ObjectId;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: any;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  createdAt: Date;
  processedAt?: Date;
  retryCount?: number;
  error?: string;
}

export const OUTBOX_COLLECTION = "outbox";
