import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';

export const GET: RequestHandler = async () => {
  try {
    const { rows } = await db.sql`SELECT * FROM beaches`;
    return json(rows);
  } catch (error) {
    console.error('Error fetching beaches:', error);
    return json({ error: 'Failed to fetch beaches' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  const beach = await request.json();
  try {
    const { rows } = await db.sql`
      INSERT INTO beaches (name, location_id, youtube_video_id)
      VALUES (${beach.name}, ${beach.location_id}, ${beach.youtube_video_id})
      RETURNING *
    `;
    return json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error adding beach:', error);
    return json({ error: 'Failed to add beach' }, { status: 500 });
  }
};