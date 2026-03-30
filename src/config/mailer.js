async function sendInvoiceEmail({ to, subject, text, pdfBuffer, filename }) {
  const transporter = createTransport();

  console.log("📧 SMTP DEBUG:", {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS ? "SET" : "MISSING",
  });

  try {
    if (process.env.SMTP_HOST) {
      await transporter.verify();
      console.log("✅ SMTP connection verified");
    }

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || "GENLAB Billing <no-reply@example.com>",
      to,
      subject,
      text,
      attachments: [{ filename, content: pdfBuffer, contentType: "application/pdf" }],
    });

    console.log("✅ MAIL SENT:", info.response);
    return { simulated: false, info };

  } catch (error) {
    console.error("❌ MAIL ERROR:", error.message);
    throw error;
  }
}
