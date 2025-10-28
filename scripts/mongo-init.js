// This script will be executed when the mongo1 container starts
print("Creating application database and user...");
db = db.getSiblingDB("todo_app");

// Create a user for your application if it doesn't exist
if (!db.getUser("app_user")) {
  db.createUser({
    user: "app_user",
    pwd: "app_password",
    roles: [
      { role: "readWrite", db: "todo_app" }
    ]
  });
}