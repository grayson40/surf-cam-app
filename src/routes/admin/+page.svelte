<script lang="ts">
  import { onMount } from 'svelte';
  import EditBeachModal from '../../components/EditBeachModal.svelte';
  import type { Beach } from '../types';

  let beaches: Beach[] = [];
  let newBeach: Partial<Beach> = { name: '', location_id: '', youtube_video_id: '' };
  let selectedBeach: Partial<Beach> = {};
  let showModal = false;

  onMount(async () => {
    await fetchBeaches();
  });

  async function fetchBeaches() {
    const response = await fetch('/api/beaches');
    beaches = await response.json();
  }

  async function addBeach() {
    const response = await fetch('/api/beaches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBeach)
    });
    if (response.ok) {
      await fetchBeaches();
      newBeach = { name: '', location_id: '', youtube_video_id: '' };
    }
  }

  async function deleteBeach(id: number) {
    const response = await fetch(`/api/beaches/${id}`, { method: 'DELETE' });
    if (response.ok) {
      await fetchBeaches();
    }
  }

  function openEditModal(beach: Beach) {
    selectedBeach = { ...beach };
    showModal = true;
  }

  function closeEditModal() {
    showModal = false;
  }

  async function saveChanges() {
    await fetchBeaches();
    closeEditModal();
  }
</script>

<main>
  <h1>Admin Panel</h1>

  <section class="add-beach">
    <h2>Add New Beach</h2>
    <form on:submit|preventDefault={addBeach}>
      <input bind:value={newBeach.name} placeholder="Beach Name" required>
      <input bind:value={newBeach.location_id} placeholder="Surfline Location ID" required>
      <input bind:value={newBeach.youtube_video_id} placeholder="YouTube Video ID" required>
      <button type="submit">Add Beach</button>
    </form>
  </section>

  <section class="existing-beaches">
    <h2>Existing Beaches</h2>
    <ul>
      {#each beaches as beach (beach.id)}
        <li>
          <span>{beach.name}</span>
          <div class="buttons">
            <button class="edit" on:click={() => openEditModal(beach)}>Edit</button>
            <button class="delete" on:click={() => deleteBeach(beach.id)}>Delete</button>
          </div>
        </li>
      {/each}
    </ul>
  </section>

  {#if showModal}
    <EditBeachModal beach={selectedBeach} on:close={closeEditModal} on:save={saveChanges} />
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  h1 {
    color: #0077be;
    text-align: center;
    font-size: 2em;
    margin-bottom: 30px;
  }

  h2 {
    color: #0077be;
    font-size: 1.5em;
    margin-bottom: 15px;
  }

  section {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
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

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  li span {
    font-size: 1.1em;
  }

  .buttons {
    display: flex;
    gap: 10px;
  }

  .edit {
    background-color: #0077be;
  }

  .delete {
    background-color: #ff4136;
  }

  .edit:hover {
    background-color: #005c8f;
  }

  .delete:hover {
    background-color: #d30000;
  }

  @media (max-width: 600px) {
    main {
      padding: 10px;
    }

    h1 {
      font-size: 1.8em;
    }

    h2 {
      font-size: 1.3em;
    }

    li {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .buttons {
      align-self: flex-end;
    }
  }
</style>