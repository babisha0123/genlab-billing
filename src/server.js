require("dotenv").config();

const app = require("./app");

const { connectDb } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDb();
  const server = app.listen(PORT, () => {
    console.log(`GENLAB-BILLING running on http://localhost:${PORT}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the stale process or change PORT in .env.`);
    } else {
      console.error("Failed to start HTTP server:", error.message);
    }

    process.exit(1);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});