const mongoose = require("mongoose");

const globalMongoose = global;
const cached = globalMongoose.__genlabMongoose || {
  conn: null,
  promise: null
};

globalMongoose.__genlabMongoose = cached;

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

function getMongoUri() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    return mongoUri;
  }

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    throw new Error("MONGODB_URI is required in production.");
  }

  return "mongodb://127.0.0.1:27017/genlab-billing";
}

async function connectDb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = getMongoUri();

    cached.promise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  console.log("Connected to MongoDB");
  return cached.conn;
}

module.exports = { connectDb, isDbReady };