// const nodemailer = require("nodemailer");

// // function createTransport() {
// //   if (process.env.SMTP_HOST) {
// //     return nodemailer.createTransport({
// //       host: process.env.SMTP_HOST,
// //       port: Number(process.env.SMTP_PORT || 587),
// //       secure: process.env.SMTP_SECURE === "true",
// //       auth: process.env.SMTP_USER
// //         ? {
// //             user: process.env.SMTP_USER,
// //             pass: process.env.SMTP_PASS
// //           }
// //         : undefined
// //     });
// //   }

// //   return nodemailer.createTransport({ jsonTransport: true });
// // }
// console.log("ENV CHECK:", {
//   SMTP_HOST: process.env.SMTP_HOST,
//   SMTP_PORT: process.env.SMTP_PORT,
//   SMTP_USER: process.env.SMTP_USER,
//   SMTP_PASS: process.env.SMTP_PASS ? "✅ set" : "❌ missing",
// });

// function createTransport() {
//   if (!process.env.SMTP_HOST) {
//     console.log("⚠️  SMTP_HOST is empty — running in simulate mode");
//     return nodemailer.createTransport({ jsonTransport: true });
//   }

//   console.log("✅ SMTP_HOST found:", process.env.SMTP_HOST); // add this
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT) || 587,
//     secure: process.env.SMTP_SECURE === "true",
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });
// }

// // async function sendInvoiceEmail({ to, subject, text, pdfBuffer, filename }) {
// //   const transporter = createTransport();
// //   const info = await transporter.sendMail({
// //     from: process.env.MAIL_FROM || "GENLAB Billing <no-reply@example.com>",
// //     to,
// //     subject,
// //     text,
// //     attachments: [
// //       {
// //         filename,
// //         content: pdfBuffer,
// //         contentType: "application/pdf"
// //       }
// //     ]
// //   });

// //   return {
// //     simulated: !process.env.SMTP_HOST,
// //     info
// //   };
// // }

// async function sendInvoiceEmail({ to, subject, text, pdfBuffer, filename }) {
//   const transporter = createTransport();

//   // Verify connection before sending
//   if (process.env.SMTP_HOST) {
//     await transporter.verify(); // throws if credentials are wrong
//   }

//   const info = await transporter.sendMail({
//     from: process.env.MAIL_FROM || '"GENLAB Billing" <no-reply@example.com>',
//     to,
//     subject,
//     text,
//     attachments: [{ filename, content: pdfBuffer, contentType: "application/pdf" }],
//   });

//   console.log("Mail result:", info.messageId, info.response ?? "(simulated)");
//   return { simulated: !process.env.SMTP_HOST, info };
// }

// module.exports = { sendInvoiceEmail };


const nodemailer = require("nodemailer");

// DO NOT call require("dotenv").config() here
// dotenv is already loaded in server.js before this file is ever required

function createTransport() {
  if (!process.env.SMTP_HOST) {
    console.log("⚠️  SMTP_HOST is empty — running in simulate mode");
    return nodemailer.createTransport({ jsonTransport: true });
  }

  console.log("✅ SMTP_HOST found:", process.env.SMTP_HOST);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendInvoiceEmail({ to, subject, text, pdfBuffer, filename }) {
  const transporter = createTransport();

  if (process.env.SMTP_HOST) {
    await transporter.verify();
  }

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || "GENLAB Billing <no-reply@example.com>",
    to,
    subject,
    text,
    attachments: [{ filename, content: pdfBuffer, contentType: "application/pdf" }],
  });

  console.log("Mail result:", info.messageId, info.response ?? "(simulated)");
  return { simulated: !process.env.SMTP_HOST, info };
}

module.exports = { sendInvoiceEmail };
// ```

// **The key change:** The `console.log("ENV CHECK"...)` block you had at the top of `mailer.js` was running at `require()` time — before `dotenv` had loaded. Moving `dotenv.config()` with the correct `__dirname` path to `server.js` as line 1, and removing it entirely from `mailer.js`, ensures env vars are set before anything else loads.

// After saving both files, restart and you should see in the terminal:
// ```
// ✅ SMTP_HOST found: smtp.gmail.com
// Mail result: <some-message-id> 250 2.0.0 OK