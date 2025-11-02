import { ChangeStream, Db } from "mongodb";
import { OutboxEvent, OUTBOX_COLLECTION } from "../models/Outbox";

let changeStream: ChangeStream | null = null;

export const initOutboxStream = (db: Db) => {
  try {
    const outboxCollection = db.collection<OutboxEvent>(OUTBOX_COLLECTION);

    // Create change stream to watch for insert operations
    changeStream = outboxCollection.watch(
      [{ $match: { operationType: 'insert' } }],
      { fullDocument: 'updateLookup' }
    );

    console.log("📨 Outbox Change Stream initialized - listening for new events...");

    // Listen to change stream events
    changeStream.on('change', (change) => {
      console.log(JSON.stringify(change, null, 2));
      if (change.operationType === 'insert' && change.fullDocument) {
        const event = change.fullDocument;
        console.log(JSON.stringify(event, null, 2));
        console.log('\n🎯 New Outbox Event Detected:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📋 Event Type: ${event.eventType}`);
        console.log(`🔖 Aggregate Type: ${event.aggregateType}`);
        console.log(`🆔 Aggregate ID: ${event.aggregateId}`);
        console.log(`📦 Payload:`, JSON.stringify(event.payload, null, 2));
        console.log(`✅ Status: ${event.status}`);
        console.log(`⏰ Created At: ${event.createdAt}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      }
    });

    changeStream.on('error', (error) => {
      console.error('❌ Error in Outbox Change Stream:', error);
    });

    changeStream.on('close', () => {
      console.log('🔒 Outbox Change Stream closed');
    });

  } catch (error) {
    console.error('Failed to initialize Outbox Change Stream:', error);
    throw error;
  }
};

export const closeOutboxStream = async () => {
  if (changeStream) {
    await changeStream.close();
    changeStream = null;
    console.log('Outbox Change Stream connection closed');
  }
};
