const mongoose = require("mongoose");

async function connectDb() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/genlab-billing";
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
}

module.exports = connectDb;