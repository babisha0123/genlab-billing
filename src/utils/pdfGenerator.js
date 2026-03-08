const PDFDocument = require("pdfkit");

function generateInvoicePdf(invoice) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(22).text("GENLAB Billing Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Issued At: ${new Date(invoice.issuedAt).toLocaleString()}`);
    doc.text(`Payment Status: ${invoice.paymentStatus}`);
    doc.moveDown();

    doc.fontSize(14).text("Customer Details");
    doc.fontSize(12).text(invoice.customer.name);
    doc.text(invoice.customer.email);
    doc.text(invoice.customer.contactNumber);
    doc.text(invoice.customer.address);
    doc.moveDown();

    doc.fontSize(14).text("Items");
    invoice.items.forEach((item, index) => {
      doc.fontSize(12).text(
        `${index + 1}. ${item.name} | Qty: ${item.quantity} | Unit: ${item.unitPrice.toFixed(2)} | Tax: ${item.taxPercent}% | Total: ${item.total.toFixed(2)}`
      );
    });

    doc.moveDown();
    doc.text(`Subtotal: ${invoice.totalSubtotal.toFixed(2)}`);
    doc.text(`Tax: ${invoice.totalTax.toFixed(2)}`);
    doc.fontSize(14).text(`Grand Total: ${invoice.totalAmount.toFixed(2)}`);
    doc.end();
  });
}

module.exports = { generateInvoicePdf };