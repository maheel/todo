// scripts/setup-replica.js
print("Initializing MongoDB Replica Set...");

try {
  // Try to get current replica set status
  const currentStatus = rs.status();
  print("✅ Replica set already initialized");
  print("Current members:");
  printjson(currentStatus.members);
} catch (error) {
  // If error, initialize the replica set
  print("⏳ Configuring replica set...");

  const config = {
    _id: "rs0",
    members: [
      { _id: 0, host: "mongo1:27017", priority: 2 },
      { _id: 1, host: "mongo2:27017", priority: 1 },
      { _id: 2, host: "mongo3:27017", priority: 1 }
    ]
  };

  rs.initiate(config);
  print("⏳ Waiting for replica set to stabilize...");
  sleep(10000);

  print("✅ Replica set initialized");
  const status = rs.status();
  printjson(status);
}