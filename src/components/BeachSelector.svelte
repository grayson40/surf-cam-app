<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import type { Beach } from '../routes/types';

  const dispatch = createEventDispatcher<{select: Beach}>();

  let beaches: Beach[] = [];
  let selectedBeach: Beach | null = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/beaches');
      if (!response.ok) throw new Error('Failed to fetch beaches');
      beaches = await response.json();
    } catch (error) {
      console.error('Error loading beaches:', error);
    }
  });

  function handleSelect(beach: Beach) {
    selectedBeach = beach;
    dispatch('select', beach);
  }
</script>

<div class="beach-selector">
  <h2>Select a Beach</h2>
  <ul>
    {#each beaches as beach (beach.id)}
      <li>
        <button
          class:selected={selectedBeach === beach}
          on:click={() => handleSelect(beach)}
        >
          {beach.name}
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .beach-selector {
    margin-bottom: 20px;
  }

  h2 {
    color: #0077be;
    font-size: 1.2em;
  }

  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  button {
    background-color: #f0f0f0;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 0.9em;
  }

  button:hover {
    background-color: #e0e0e0;
  }

  button.selected {
    background-color: #0077be;
    color: white;
  }

  @media (min-width: 768px) {
    h2 {
      font-size: 1.5em;
    }

    button {
      font-size: 1em;
    }
  }
</style>