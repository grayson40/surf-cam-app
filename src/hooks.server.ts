import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/admin')) {
    const auth = event.request.headers.get('Authorization');
    if (auth !== `Basic ${btoa('admin:password')}`) {
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