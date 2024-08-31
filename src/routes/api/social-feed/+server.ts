import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import type { Post } from '$lib/types';

export const GET: RequestHandler = async ({ url }) => {
  const beachId = url.searchParams.get('beachId');
  
  if (!beachId) {
    return json({ error: 'Beach ID is required' }, { status: 400 });
  }

  try {
    const { rows } = await db.sql<Post>`
      SELECT *
      FROM posts
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
  const formData = await request.formData();
  const beachId = formData.get('beachId') as string;
  const content = formData.get('content') as string;
  const author = formData.get('author') as string; // Assuming you're sending the author name
  const media = formData.get('media') as File | null;

  if (!beachId || !content || !author) {
    return json({ error: 'Beach ID, content, and author are required' }, { status: 400 });
  }

  try {
    let mediaUrl = null;
    if (media) {
      // Here you would typically upload the media file to a storage service
      // and get back a URL. For this example, we'll just use a placeholder.
      mediaUrl = 'https://example.com/media/' + media.name;
    }

    const { rows } = await db.sql<Post>`
      INSERT INTO posts (beach_id, author, content, media_url)
      VALUES (${beachId}, ${author}, ${content}, ${mediaUrl})
      RETURNING *
    `;
    return json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error adding post:', error);
    return json({ error: 'Failed to add post' }, { status: 500 });
  }
};