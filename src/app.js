const express = require("express");
const cors = require("cors");
const path = require("path");

const { isDbReady } = require("./config/db");
const customerRoutes = require("./routes/customerRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();
const publicDir = path.join(__dirname, "..", "public");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "GENLAB-BILLING" });
});

app.use("/api", (req, res, next) => {
  if (!isDbReady()) {
    return res.status(503).json({
      message: "Database unavailable. Verify MongoDB is running, confirm that MONGODB_URI is correct, and restart the server."
    });
  }

  next();
});

app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error."
  });
});

module.exports = app;