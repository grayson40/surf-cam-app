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
      SELECT * FROM posts
      WHERE beach_id = ${beachId}
      ORDER BY timestamp DESC LIMIT 20
    `;
    return json(rows);
  } catch (error) {
    console.error('Error fetching social feed:', error);
    return json({ error: 'Failed to fetch social feed' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  const post = await request.json();
  try {
    const { rows } = await db.sql`
      INSERT INTO posts (beach_id, author, content, media_url)
      VALUES (${post.beachId}, ${post.author}, ${post.content}, ${post.mediaUrl})
      RETURNING *
    `;
    return json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error adding post:', error);
    return json({ error: 'Failed to add post' }, { status: 500 });
  }
};