import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const config = {
  botToken: required('BOT_TOKEN'),
  zelapiUrl: (process.env.ZELAPI_URL || 'https://zelapi.eu.cc').replace(/\/$/, ''),
  zelapiKey: required('ZELAPI_KEY'),
  timeout: Number(process.env.REQUEST_TIMEOUT_MS || 15000)
};
