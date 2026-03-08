const express = require("express");
const { listCustomers, createCustomer } = require("../controllers/customerController");

const router = express.Router();

router.get("/", listCustomers);
router.post("/", createCustomer);

module.exports = router;