const itemsContainer = document.getElementById("items");
const itemTemplate = document.getElementById("item-template");
const invoiceForm = document.getElementById("invoice-form");
const formMessage = document.getElementById("form-message");
const invoicePreview = document.getElementById("invoice-preview");
const invoiceList = document.getElementById("invoice-list");

function addItemRow(defaults = {}) {
  const fragment = itemTemplate.content.cloneNode(true);
  const row = fragment.querySelector(".item-row");
  row.querySelector('[name="itemName"]').value = defaults.name || "";
  row.querySelector('[name="quantity"]').value = defaults.quantity || 1;
  row.querySelector('[name="unitPrice"]').value = defaults.unitPrice || "";
  row.querySelector('[name="taxPercent"]').value = defaults.taxPercent || 0;
  row.querySelector(".remove-item").addEventListener("click", () => row.remove());
  itemsContainer.appendChild(fragment);
}

function getInvoicePayload() {
  const formData = new FormData(invoiceForm);
  const items = [...document.querySelectorAll(".item-row")].map((row) => ({
    name: row.querySelector('[name="itemName"]').value.trim(),
    quantity: Number(row.querySelector('[name="quantity"]').value),
    unitPrice: Number(row.querySelector('[name="unitPrice"]').value),
    taxPercent: Number(row.querySelector('[name="taxPercent"]').value || 0)
  }));

  return {
    customer: {
      name: formData.get("name").trim(),
      contactNumber: formData.get("contactNumber").trim(),
      email: formData.get("email").trim(),
      address: formData.get("address").trim()
    },
    items
  };
}

function renderPreview(invoice) {
  if (!invoice) {
    invoicePreview.className = "preview empty";
    invoicePreview.textContent = "No invoice created yet.";
    return;
  }

  invoicePreview.className = "preview";
  invoicePreview.innerHTML = `
    <h3>${invoice.invoiceNumber}</h3>
    <p><strong>${invoice.customer.name}</strong> — ${invoice.customer.email}</p>
    <p>Status: <span class="status-${invoice.paymentStatus.toLowerCase()}">${invoice.paymentStatus}</span></p>
    <ul>${invoice.items.map((item) => `<li>${item.name}: ${item.quantity} × ${item.unitPrice.toFixed(2)} = ${item.total.toFixed(2)}</li>`).join("")}</ul>
    <div class="totals">
      <span>Subtotal: ${invoice.totalSubtotal.toFixed(2)}</span>
      <span>Tax: ${invoice.totalTax.toFixed(2)}</span>
      <strong>Total: ${invoice.totalAmount.toFixed(2)}</strong>
    </div>
  `;
}

function invoiceCard(invoice) {
  return `
    <article class="invoice-card">
      <header>
        <div>
          <h3>${invoice.invoiceNumber}</h3>
          <div class="invoice-meta">
            <span>${invoice.customer.name}</span>
            <span>${new Date(invoice.issuedAt).toLocaleString()}</span>
          </div>
        </div>
        <span class="status-${invoice.paymentStatus.toLowerCase()}">${invoice.paymentStatus}</span>
      </header>
      <p>${invoice.customer.email} • ${invoice.customer.contactNumber}</p>
      <p>Total Amount: <strong>${invoice.totalAmount.toFixed(2)}</strong></p>
      <div class="card-actions">
        <button onclick="toggleStatus('${invoice._id}', '${invoice.paymentStatus}')">Toggle Status</button>
        <button onclick="downloadPdf('${invoice._id}')">Download PDF</button>
        <button onclick="sendEmail('${invoice._id}')">Send Email</button>
      </div>
    </article>
  `;
}

async function fetchInvoices() {
  const response = await fetch("/api/invoices");
  const invoices = await response.json();
  invoiceList.innerHTML = invoices.length ? invoices.map(invoiceCard).join("") : "<p>No invoices saved yet.</p>";
}

async function toggleStatus(id, currentStatus) {
  const nextStatus = currentStatus === "Paid" ? "Pending" : "Paid";
  const response = await fetch(`/api/invoices/${id}/payment-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentStatus: nextStatus })
  });

  if (!response.ok) {
    alert("Unable to update payment status.");
    return;
  }

  const updated = await response.json();
  renderPreview(updated);
  fetchInvoices();
}

function downloadPdf(id) {
  window.open(`/api/invoices/${id}/pdf`, "_blank");
}

async function sendEmail(id) {
  const response = await fetch(`/api/invoices/${id}/send-email`, { method: "POST" });
  const result = await response.json();
  alert(result.message || "Email request finished.");
}

invoiceForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "Creating invoice...";

  try {
    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getInvoicePayload())
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Invoice creation failed.");
    }

    formMessage.textContent = `Invoice ${result.invoiceNumber} created successfully.`;
    renderPreview(result);
    invoiceForm.reset();
    itemsContainer.innerHTML = "";
    addItemRow();
    fetchInvoices();
  } catch (error) {
    formMessage.textContent = error.message;
  }
});

document.getElementById("add-item").addEventListener("click", () => addItemRow());
document.getElementById("refresh-invoices").addEventListener("click", fetchInvoices);

addItemRow();
fetchInvoices();

window.toggleStatus = toggleStatus;
window.downloadPdf = downloadPdf;
window.sendEmail = sendEmail;