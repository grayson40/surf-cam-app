import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sql } from '@vercel/postgres';

export const GET: RequestHandler = async () => {
  try {
    const { rows } = await sql`SELECT * FROM beaches`;
    return json(rows);
  } catch (error) {
    console.error('Error fetching beaches:', error);
    return json({ error: 'Failed to fetch beaches' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  const beach = await request.json();
  try {
    const { rows } = await sql`
      INSERT INTO beaches (name, cam_url, youtube_video_id)
      VALUES (${beach.name}, ${beach.camUrl}, ${beach.youtubeVideoId})
      RETURNING *
    `;
    return json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error adding beach:', error);
    return json({ error: 'Failed to add beach' }, { status: 500 });
  }
};