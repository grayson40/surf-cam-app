import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';

export const GET: RequestHandler = async ({ params }) => {
  const beachId = params.id;
  
  if (!beachId) {
    return json({ error: 'Beach ID is required' }, { status: 400 });
  }

  try {
    const { rows } = await db.sql`
      SELECT * FROM conditions 
      WHERE beach_id = ${beachId} 
      ORDER BY timestamp DESC 
      LIMIT 1
    `;
    return json(rows[0] || null);
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return json({ error: 'Failed to fetch conditions' }, { status: 500 });
  }
};