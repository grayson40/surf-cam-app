import { sql } from '@vercel/postgres';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  const { beachId } = params;
  try {
    const { rows } = await sql`
      SELECT recommendation FROM board_recommendations
      WHERE beach_id = ${beachId}
      ORDER BY timestamp DESC LIMIT 1
    `;
    return new Response(JSON.stringify(rows[0]), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching board recommendation:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch board recommendation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};