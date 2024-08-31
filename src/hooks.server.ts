import { config } from 'dotenv';
import type { Handle } from '@sveltejs/kit';

config(); // This loads the .env file

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/admin')) {
    const auth = event.request.headers.get('Authorization');
    if (auth !== `Basic ${btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`)}`) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"'
        }
      });
    }
  }
  return resolve(event);
};