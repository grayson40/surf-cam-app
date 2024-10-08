import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  try {
    const { rows } = await db.sql`SELECT * FROM beaches WHERE id = ${id}`;
    if (rows.length === 0) {
      return json({ error: 'Beach not found' }, { status: 404 });
    }
    return json(rows[0]);
  } catch (error) {
    console.error('Error fetching beach:', error);
    return json({ error: 'Failed to fetch beach' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  const { id } = params;
  try {
    const { rowCount } = await db.sql`DELETE FROM beaches WHERE id = ${id}`;
    if (rowCount === 0) {
      return json({ error: 'Beach not found' }, { status: 404 });
    }
    return json({ message: 'Beach deleted successfully' });
  } catch (error) {
    console.error('Error deleting beach:', error);
    return json({ error: 'Failed to delete beach' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const { id } = params;
  const updatedBeach = await request.json();
  try {
    const { rowCount } = await db.sql`
      UPDATE beaches
      SET name = ${updatedBeach.name}, location_id = ${updatedBeach.location_id}, youtube_video_id = ${updatedBeach.youtube_video_id}
      WHERE id = ${id}
    `;
    if (rowCount === 0) {
      return json({ error: 'Beach not found' }, { status: 404 });
    }
    return json({ message: 'Beach updated successfully' });
  } catch (error) {
    console.error('Error updating beach:', error);
    return json({ error: 'Failed to update beach' }, { status: 500 });
  }
};