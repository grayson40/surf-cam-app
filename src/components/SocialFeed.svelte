<script lang="ts">
  import { onMount } from 'svelte';
  import type { Beach, Post } from '../routes/types';

  export let beach: Beach | null = null;

  let posts: Post[] = [];
  let isModalOpen = false;
  let newPostContent = '';
  let newPostMedia: File | null = null;

  $: if (beach) {
    fetchPosts();
  }

  async function fetchPosts() {
    if (!beach) return;
    try {
      const response = await fetch(`/api/social-feed/${beach.id}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      posts = await response.json();
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    newPostContent = '';
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
    try {
      const formData = new FormData();
      formData.append('content', newPostContent);
      formData.append('beachId', beach.id.toString());
      if (newPostMedia) {
        formData.append('media', newPostMedia);
      }

      const response = await fetch('/api/social-feed', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to submit post');

      await fetchPosts();
      closeModal();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  }
</script>

{#if beach}
  <div class="social-feed">
    <h2>Social Feed for {beach.name}</h2>
    {#each posts as post (post.id)}
      <div class="post">
        <h3>{post.author}</h3>
        <p>{post.content}</p>
        {#if post.media_url}
          <img src={post.media_url} alt="Post media" />
        {/if}
        <div class="post-actions">
          <button>Like ({post.likes})</button>
          <button>Comment ({post.comments})</button>
        </div>
      </div>
    {/each}
  </div>

  <button class="add-post-button" on:click={openModal}>
    <span class="icon">+</span>
    <span class="text">Add Post</span>
  </button>

  {#if isModalOpen}
    <div class="modal-overlay" on:click={closeModal}>
      <div class="modal-content" on:click|stopPropagation>
        <h2>Create New Post</h2>
        <textarea
          bind:value={newPostContent}
          placeholder="What's on your mind?"
        ></textarea>
        <input type="file" accept="image/*,video/*" on:change={handleMediaChange} />
        <div class="modal-actions">
          <button on:click={closeModal}>Cancel</button>
          <button on:click={submitNewPost} disabled={!newPostContent.trim()}>Post</button>
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
    margin-bottom: 80px; /* Add space for the floating button */
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

  .add-post-button:hover {
    background-color: #005c8f;
    transform: scale(1.1);
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
</style>