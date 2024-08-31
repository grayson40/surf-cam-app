<script lang="ts">
  import { onMount } from 'svelte';
  import type { Beach, Post } from '../lib/types';

  export let beach: Beach | null = null;

  let posts: Post[] = [];
  let isModalOpen = false;
  let newPostContent = '';
  let newPostAuthor = '';
  let newPostMedia: File | null = null;
  let isLoading = false;
  let error: string | null = null;

  onMount(() => {
    if (beach) {
      fetchPosts();
    }
  });

  $: if (beach) {
    fetchPosts();
  }

  async function fetchPosts() {
    if (!beach) return;
    isLoading = true;
    error = null;
    try {
      const response = await fetch(`/api/social-feed?beachId=${beach.id}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      posts = await response.json();
    } catch (err) {
      console.error('Error loading posts:', err);
      error = 'Failed to load posts. Please try again later.';
    } finally {
      isLoading = false;
    }
  }

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    newPostContent = '';
    newPostAuthor = '';
    newPostMedia = null;
  }

  function handleMediaChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      newPostMedia = target.files[0];
    }
  }

  async function submitNewPost() {
    if (!beach) return;
    if (!newPostContent.trim() || !newPostAuthor.trim()) {
      error = 'Please provide both content and your name.';
      return;
    }
    isLoading = true;
    error = null;
    try {
      const formData = new FormData();
      formData.append('content', newPostContent);
      formData.append('author', newPostAuthor);
      formData.append('beachId', beach.id.toString());
      if (newPostMedia) {
        formData.append('media', newPostMedia);
      }

      const response = await fetch('/api/social-feed', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to submit post');

      const newPost = await response.json();
      posts = [newPost, ...posts];
      closeModal();
    } catch (err) {
      console.error('Error submitting post:', err);
      error = 'Failed to submit post. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  async function likePost(postId: number) {
    try {
      const response = await fetch(`/api/social-feed/${postId}/like`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to like post');
      const updatedPost = await response.json();
      posts = posts.map(post => post.id === updatedPost.id ? updatedPost : post);
    } catch (err) {
      console.error('Error liking post:', err);
      error = 'Failed to like post. Please try again.';
    }
  }

  async function addComment(postId: number) {
    const comment = prompt('Enter your comment:');
    const author = prompt('Enter your name:');
    if (!comment || !author) return;

    try {
      const response = await fetch(`/api/social-feed/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment, author })
      });
      if (!response.ok) throw new Error('Failed to add comment');
      const updatedPost = await response.json();
      posts = posts.map(post => post.id === updatedPost.id ? updatedPost : post);
    } catch (err) {
      console.error('Error adding comment:', err);
      error = 'Failed to add comment. Please try again.';
    }
  }
</script>

{#if beach}
  <div class="social-feed">
    <h2>Social Feed for {beach.name}</h2>
    {#if isLoading}
      <p>Loading posts...</p>
    {:else if error}
      <p class="error">{error}</p>
    {:else if posts.length === 0}
      <p>No posts yet. Be the first to share!</p>
    {:else}
      {#each posts as post (post.id)}
        <div class="post">
          <h3>{post.author}</h3>
          <p>{post.content}</p>
          {#if post.media_url}
            <img src={post.media_url} alt="Post media" />
          {/if}
          <div class="post-actions">
            <button on:click={() => likePost(post.id)}>Like ({post.likes})</button>
            <button on:click={() => addComment(post.id)}>
              Comment ({post.comments})
            </button>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <button class="add-post-button" on:click={openModal} disabled={isLoading}>
    <span class="icon">+</span>
    <span class="text">Add Post</span>
  </button>

  {#if isModalOpen}
    <div class="modal-overlay" on:click={closeModal}>
      <div class="modal-content" on:click|stopPropagation>
        <h2>Create New Post</h2>
        <input
          bind:value={newPostAuthor}
          placeholder="Your Name"
          disabled={isLoading}
        />
        <textarea
          bind:value={newPostContent}
          placeholder="What's on your mind?"
          disabled={isLoading}
        ></textarea>
        <input type="file" accept="image/*,video/*" on:change={handleMediaChange} disabled={isLoading} />
        {#if error}
          <p class="error">{error}</p>
        {/if}
        <div class="modal-actions">
          <button on:click={closeModal} disabled={isLoading}>Cancel</button>
          <button on:click={submitNewPost} disabled={isLoading || !newPostContent.trim() || !newPostAuthor.trim()}>
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  {/if}
{/if}

<style>
  .social-feed {
    margin-top: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 80px;
  }

  .post {
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .post h3 {
    margin-top: 0;
    color: #0077be;
  }

  .post img {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .post-actions {
    display: flex;
    gap: 10px;
  }

  .add-post-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #0077be;
    color: white;
    border: none;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, transform 0.3s;
  }

  .add-post-button:hover:not(:disabled) {
    background-color: #005c8f;
    transform: scale(1.1);
  }

  .add-post-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .add-post-button .icon {
    display: block;
  }

  .add-post-button .text {
    display: none;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
  }

  .modal-content textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 10px;
    padding: 5px;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .error {
    color: red;
    font-weight: bold;
  }

  @media (min-width: 768px) {
    .add-post-button {
      width: auto;
      height: auto;
      border-radius: 28px;
      padding: 10px 20px;
    }

    .add-post-button .icon {
      display: none;
    }

    .add-post-button .text {
      display: inline;
    }
  }

  input, textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>