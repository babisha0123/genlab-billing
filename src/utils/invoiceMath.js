function roundCurrency(value) {
  return Number(value.toFixed(2));
}

function buildInvoiceTotals(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("At least one invoice item is required.");
  }

  const normalizedItems = items.map((item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    const taxPercent = Number(item.taxPercent || 0);

    if (!item.name || quantity <= 0 || unitPrice < 0 || taxPercent < 0) {
      throw new Error("Each item must include a valid name, quantity, price, and tax value.");
    }

    const subtotal = roundCurrency(quantity * unitPrice);
    const taxAmount = roundCurrency(subtotal * (taxPercent / 100));
    const total = roundCurrency(subtotal + taxAmount);

    return {
      name: item.name,
      quantity,
      unitPrice,
      taxPercent,
      subtotal,
      taxAmount,
      total
    };
  });

  const totalSubtotal = roundCurrency(normalizedItems.reduce((sum, item) => sum + item.subtotal, 0));
  const totalTax = roundCurrency(normalizedItems.reduce((sum, item) => sum + item.taxAmount, 0));
  const totalAmount = roundCurrency(totalSubtotal + totalTax);

  return { normalizedItems, totalSubtotal, totalTax, totalAmount };
}

module.exports = { buildInvoiceTotals };