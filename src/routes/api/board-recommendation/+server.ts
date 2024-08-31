import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
  const beachId = url.searchParams.get('beachId');
  
  if (!beachId) {
    return json({ error: 'Beach ID is required' }, { status: 400 });
  }

  try {
    const { rows } = await db.sql`
      SELECT recommendation FROM board_recommendations
      WHERE beach_id = ${beachId}
      ORDER BY timestamp DESC LIMIT 1
    `;
    return json(rows[0] || { recommendation: "No recommendation available" });
  } catch (error) {
    console.error('Error fetching board recommendation:', error);
    return json({ error: 'Failed to fetch board recommendation' }, { status: 500 });
  }
};