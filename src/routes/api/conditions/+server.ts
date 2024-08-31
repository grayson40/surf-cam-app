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

export const POST: RequestHandler = async ({ request }) => {
  const condition = await request.json();
  try {
    const { rows } = await db.sql`
      INSERT INTO conditions (
        beach_id, wave_height, wind_speed, wind_direction, temperature, tide
      ) VALUES (
        ${condition.beachId}, ${condition.waveHeight}, ${condition.windSpeed}, 
        ${condition.windDirection}, ${condition.temperature}, ${condition.tide}
      )
      RETURNING *
    `;
    return json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error adding condition:', error);
    return json({ error: 'Failed to add condition' }, { status: 500 });
  }
};