const nodemailer = require("nodemailer");

function createTransport() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
    });
  }

  return nodemailer.createTransport({ jsonTransport: true });
}

async function sendInvoiceEmail({ to, subject, text, pdfBuffer, filename }) {
  const transporter = createTransport();
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || "GENLAB Billing <no-reply@example.com>",
    to,
    subject,
    text,
    attachments: [
      {
        filename,
        content: pdfBuffer,
        contentType: "application/pdf"
      }
    ]
  });

  return {
    simulated: !process.env.SMTP_HOST,
    info
  };
}

module.exports = { sendInvoiceEmail };