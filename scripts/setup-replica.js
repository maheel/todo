
// scripts/setup-replica.js
print("🔄 Checking replica set status...");

let initialized = false;
let attempts = 0;
const maxAttempts = 10;

while (!initialized && attempts < maxAttempts) {
  try {
    const status = rs.status();
    if (status.ok === 1) {
      print("✅ Replica set is already initialized");
      print("Current members:");
      status.members.forEach(member => {
        print(`  - ${member.name} (${member.stateStr})`);
      });
      initialized = true;
    }
  } catch (error) {
    if (error.message && error.message.includes("no replset config")) {
      print(`⏳ Attempt ${attempts + 1}/${maxAttempts}: Initializing replica set with localhost addresses...`);

      try {
        const config = {
          _id: "rs0",
          members: [
            { _id: 0, host: "localhost:27017", priority: 2 },
            { _id: 1, host: "localhost:27018", priority: 1 },
            { _id: 2, host: "localhost:27019", priority: 1 }
          ]
        };

        const result = rs.initiate(config);
        print("Initiate result: " + JSON.stringify(result));

        print("⏳ Waiting for replica set to stabilize (10 seconds)...");
        sleep(10000);

        const statusAfter = rs.status();
        if (statusAfter.ok === 1) {
          print("✅ Replica set initialized successfully!");
          print("Configured members:");
          statusAfter.members.forEach(member => {
            print(`  - ${member.name} (${member.stateStr})`);
          });
          initialized = true;
        }
      } catch (initError) {
        print("⚠️  Initialization attempt failed: " + initError.message);
        sleep(2000);
        attempts++;
      }
    } else {
      print("❌ Unexpected error: " + error.message);
      throw error;
    }
  }
}

if (!initialized) {
  print("❌ Failed to initialize replica set after " + maxAttempts + " attempts");
  throw new Error("Replica set initialization failed");
}

print("✅ Setup complete! Replica set is ready for external connections.");