# GENLAB-BILLING

Minimal full-stack billing system built with HTML/CSS/JavaScript, Node.js/Express, and MongoDB.

## Features

- Customer information capture
- Item/service entry with tax calculations
- Invoice generation and history
- Payment status updates (`Pending` / `Paid`)
- PDF invoice download
- Email sending with JSON transport fallback when SMTP is not configured

## Quick start

1. Install dependencies:
   - `npm install`
2. Copy env file:
   - PowerShell: `Copy-Item .env.example .env`
3. Start MongoDB locally or update `MONGODB_URI`
4. Run the app:
   - `npm start`
5. Open:
   - `http://localhost:5000`

## Troubleshooting

- If you see `Operation customers.findOneAndUpdate() buffering timed out after 10000ms`:
  - the frontend request is usually fine; MongoDB is unavailable to the backend process handling the request
  - make sure MongoDB is running
  - verify `MONGODB_URI` in `.env`
  - restart the server after fixing MongoDB
- If startup fails with `EADDRINUSE` on port `5000`:
  - find the existing process: `netstat -ano | findstr :5000`
  - stop it: `taskkill /PID <PID> /F`

## Structure

- `public/` - static frontend
- `src/config/` - database and mailer config
- `src/controllers/` - API request handlers
- `src/models/` - Mongoose models
- `src/routes/` - Express routes
- `src/utils/` - invoice number, totals, PDF generation
