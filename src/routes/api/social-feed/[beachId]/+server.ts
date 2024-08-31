import { sql } from '@vercel/postgres';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  const { beachId } = params;
  try {
    const { rows } = await sql`
      SELECT * FROM posts
      WHERE beach_id = ${beachId}
      ORDER BY timestamp DESC LIMIT 20
    `;
    return new Response(JSON.stringify(rows), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching social feed:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch social feed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};