function createInvoiceNumber() {
  const stamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
  const random = Math.floor(100 + Math.random() * 900);
  return `INV-${stamp}-${random}`;
}

module.exports = createInvoiceNumber;