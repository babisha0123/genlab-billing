const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

function isDbReady() {
  return mongoose.connection.readyState === 1;
}

async function connectDb() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/genlab-billing";

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });

  console.log("Connected to MongoDB");
}

module.exports = { connectDb, isDbReady };