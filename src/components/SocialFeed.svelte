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
        <button on:click={() => handleSelect(beach)}>
          {beach.name}
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .beach-selector {
    margin-top: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 15px;
  }

  .beach-selector h2 {
    margin-top: 0;
    font-size: 1.2em;
  }

  .beach-selector ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .beach-selector li {
    margin-bottom: 10px;
  }

  .beach-selector button {
    background-color: #0077be;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 1em;
    width: 100%;
  }

  .beach-selector button:hover {
    background-color: #005c8f;
  }
</style>