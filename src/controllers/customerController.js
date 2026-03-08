const Customer = require("../models/Customer");

async function listCustomers(req, res, next) {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 }).lean();
    res.json(customers);
  } catch (error) {
    next(error);
  }
}

async function createCustomer(req, res, next) {
  try {
    const { name, contactNumber, email, address } = req.body;

    if (!name || !contactNumber || !email || !address) {
      return res.status(400).json({ message: "Name, contact number, email, and address are required." });
    }

    const customer = await Customer.findOneAndUpdate(
      { email: email.toLowerCase() },
      { name, contactNumber, email, address },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
}

module.exports = { listCustomers, createCustomer };