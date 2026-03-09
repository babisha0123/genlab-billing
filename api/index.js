const app = require("../src/app");
const { connectDb } = require("../src/config/db");

module.exports = async (req, res) => {
  try {
    await connectDb();
    return app(req, res);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    return res.status(503).json({
      message: "Database unavailable. Verify MongoDB is running, confirm that MONGODB_URI is correct, and restart the server."
    });
  }
};