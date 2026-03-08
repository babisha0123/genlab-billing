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
   - `copy .env.example .env`
3. Start MongoDB locally or update `MONGODB_URI`
4. Run the app:
   - `npm run dev`
5. Open:
   - `http://localhost:5000`

## Structure

- `public/` - static frontend
- `src/config/` - database and mailer config
- `src/controllers/` - API request handlers
- `src/models/` - Mongoose models
- `src/routes/` - Express routes
- `src/utils/` - invoice number, totals, PDF generation
