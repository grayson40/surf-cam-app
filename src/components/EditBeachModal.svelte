<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Beach } from '../lib/types';

  export let beach: Partial<Beach> = { name: '', location_id: '', youtube_video_id: '' };
  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }

  async function saveChanges() {
    const response = await fetch(`/api/beaches/${beach.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(beach)
    });
    if (response.ok) {
      dispatch('save');
      closeModal();
    }
  }
</script>

<div class="modal">
  <div class="modal-content">
    <span class="close" on:click={closeModal}>&times;</span>
    <h2>Edit Beach</h2>
    <form on:submit|preventDefault={saveChanges}>
      <label for="beach-name">Beach Name</label>
      <input id="beach-name" bind:value={beach.name} placeholder="Beach Name" required>
      
      <label for="location-id">Surfline Location ID</label>
      <input id="location-id" bind:value={beach.location_id} placeholder="Surfline Location ID" required>
      
      <label for="youtube-video-id">YouTube Video ID</label>
      <input id="youtube-video-id" bind:value={beach.youtube_video_id} placeholder="YouTube Video ID" required>
      
      <button type="submit">Save Changes</button>
    </form>
  </div>
</div>

<style>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .modal-content {
    background-color: #fefefe;
    padding: 20px;
    border: 1px solid #888;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
  }

  h2 {
    margin-top: 0;
    color: #0077be;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
  }

  button {
    background-color: #0077be;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 1em;
  }

  button:hover {
    background-color: #005c8f;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>