import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import type { Post, Comment } from '$lib/types';

export const POST: RequestHandler = async ({ params, request }) => {
  const postId = params.postId;
  const { comment, author } = await request.json();

  if (!comment || !author) {
    return json({ error: 'Comment and author are required' }, { status: 400 });
  }

  try {
    await db.sql<Comment>`
      INSERT INTO comments (post_id, content, author)
      VALUES (${postId}, ${comment}, ${author})
    `;

    const { rows } = await db.sql<Post>`
      UPDATE posts
      SET comments = comments + 1
      WHERE id = ${postId}
      RETURNING *
    `;

    return json(rows[0]);
  } catch (error) {
    console.error('Error adding comment:', error);
    return json({ error: 'Failed to add comment' }, { status: 500 });
  }
};