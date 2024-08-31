import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import type { Post } from '$lib/types';

export const POST: RequestHandler = async ({ params }) => {
  const postId = params.postId;

  try {
    const { rows } = await db.sql<Post>`
      UPDATE posts
      SET likes = likes + 1
      WHERE id = ${postId}
      RETURNING *
    `;

    return json(rows[0]);
  } catch (error) {
    console.error('Error liking post:', error);
    return json({ error: 'Failed to like post' }, { status: 500 });
  }
};