import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sql } from '@vercel/postgres';

export const DELETE: RequestHandler = async ({ params }) => {
  const { id } = params;
  try {
    await sql`DELETE FROM beaches WHERE id = ${id}`;
    return json({ message: 'Beach deleted successfully' });
  } catch (error) {
    console.error('Error deleting beach:', error);
    return json({ error: 'Failed to delete beach' }, { status: 500 });
  }
};