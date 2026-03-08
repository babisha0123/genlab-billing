const express = require("express");
const {
  listInvoices,
  getInvoice,
  createInvoice,
  updatePaymentStatus,
  downloadInvoicePdf,
  emailInvoice
} = require("../controllers/invoiceController");

const router = express.Router();

router.get("/", listInvoices);
router.post("/", createInvoice);
router.get("/:id", getInvoice);
router.patch("/:id/payment-status", updatePaymentStatus);
router.get("/:id/pdf", downloadInvoicePdf);
router.post("/:id/send-email", emailInvoice);

module.exports = router;