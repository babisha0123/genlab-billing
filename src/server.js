require("dotenv").config();

const app = require("./app");
const connectDb = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`GENLAB-BILLING running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});