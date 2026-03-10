const serverless = require("serverless-http");
const app = require("../src/app");
const { connectDb } = require("../src/config/db");

let cachedHandler;

async function getHandler() {
  await connectDb();

  if (!cachedHandler) {
    cachedHandler = serverless(app);
  }

  return cachedHandler;
}

module.exports = async (req, res) => {
  try {
    const handler = await getHandler();
    return handler(req, res);
  } catch (error) {
    console.error("Server error:", error);

    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
};