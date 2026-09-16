# Rynam Tele

Modular Telegram bot with a server-side API integration.

## Setup

1. Install Node.js 18+.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Fill in `BOT_TOKEN` and `ZELAPI_KEY`.
5. Run `npm start`.

## Premium plugin

The premium plugin uses the configured API server:

- `POST /api/v1/premium/send` with `{ "email": "..." }`
- `POST /api/v1/premium/verif` with `{ "email": "...", "link": "..." }`

The API key is read only from the environment and is never stored in the source code.

## Commands

- `/start`
- `/help`
- `/premium email@gmail.com`
- `/cancel`

## Notes

The pending email state is kept in memory for this initial version. For production, use a persistent store such as Redis or a database if the bot may restart or run multiple instances.
