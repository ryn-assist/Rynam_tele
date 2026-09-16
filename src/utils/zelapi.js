import axios from 'axios';
import { config } from '../config.js';

const client = axios.create({
  baseURL: config.zelapiUrl,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.zelapiKey}`
  }
});

function apiError(error) {
  if (error.response) {
    const data = error.response.data;
    const message = typeof data === 'object' && data?.message
      ? data.message
      : `API returned HTTP ${error.response.status}`;
    return new Error(message);
  }
  if (error.code === 'ECONNABORTED') return new Error('API timeout. Coba lagi.');
  return new Error('Tidak dapat terhubung ke API.');
}

export async function sendVerification(email) {
  try {
    const { data } = await client.post('/api/v1/premium/send', { email });
    return data;
  } catch (error) {
    throw apiError(error);
  }
}

export async function verifyLink(email, link) {
  try {
    const { data } = await client.post('/api/v1/premium/verif', { email, link });
    return data;
  } catch (error) {
    throw apiError(error);
  }
}
