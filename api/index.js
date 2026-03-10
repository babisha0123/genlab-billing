const serverless = require("serverless-http");
const app = require("../src/app");
const { connectDb } = require("../src/config/db");

let handler;

module.exports = async (req, res) => {
  try {
    await connectDb();

    if (!handler) {
      handler = serverless(app);
    }

    return handler(req, res);
  } catch (error) {
    console.error("Database connection failed:", error);
    return res.status(500).json({
      message: "Database connection failed"
    });
  }
};