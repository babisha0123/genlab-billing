const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");
const createInvoiceNumber = require("../utils/invoiceNumber");
const { buildInvoiceTotals } = require("../utils/invoiceMath");
const { generateInvoicePdf } = require("../utils/pdfGenerator");
const { sendInvoiceEmail } = require("../config/mailer");

async function listInvoices(req, res, next) {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 }).lean();
    res.json(invoices);
  } catch (error) {
    next(error);
  }
}

async function getInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    res.json(invoice);
  } catch (error) {
    next(error);
  }
}

async function createInvoice(req, res, next) {
  try {
    const { customer, items } = req.body;

    if (!customer || !customer.name || !customer.contactNumber || !customer.email || !customer.address) {
      return res.status(400).json({ message: "Complete customer information is required." });
    }

    const savedCustomer = await Customer.findOneAndUpdate(
      { email: customer.email.toLowerCase() },
      customer,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const totals = buildInvoiceTotals(items);

    const invoice = await Invoice.create({
      invoiceNumber: createInvoiceNumber(),
      customer: {
        customerId: savedCustomer._id,
        name: savedCustomer.name,
        contactNumber: savedCustomer.contactNumber,
        email: savedCustomer.email,
        address: savedCustomer.address
      },
      items: totals.normalizedItems,
      totalSubtotal: totals.totalSubtotal,
      totalTax: totals.totalTax,
      totalAmount: totals.totalAmount,
      paymentStatus: "Pending"
    });

    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
}

async function updatePaymentStatus(req, res, next) {
  try {
    const { paymentStatus } = req.body;
    if (!["Pending", "Paid"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Payment status must be Pending or Paid." });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    res.json(invoice);
  } catch (error) {
    next(error);
  }
}

async function downloadInvoicePdf(req, res, next) {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    const pdfBuffer = await generateInvoicePdf(invoice);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${invoice.invoiceNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}

async function emailInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    const pdfBuffer = await generateInvoicePdf(invoice);
    const result = await sendInvoiceEmail({
      to: invoice.customer.email,
      subject: `Invoice ${invoice.invoiceNumber}`,
      text: `Hello ${invoice.customer.name}, please find your invoice attached. Total due: ${invoice.totalAmount.toFixed(2)}.`,
      pdfBuffer,
      filename: `${invoice.invoiceNumber}.pdf`
    });

    res.json({
      message: result.simulated ? "Invoice email simulated successfully." : "Invoice email sent successfully.",
      simulated: result.simulated,
      invoiceNumber: invoice.invoiceNumber
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listInvoices,
  getInvoice,
  createInvoice,
  updatePaymentStatus,
  downloadInvoicePdf,
  emailInvoice
};