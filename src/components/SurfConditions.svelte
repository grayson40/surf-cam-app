<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import type { Beach, Conditions } from '../routes/types';

  export let beach: Beach;

  let conditions: Conditions | null = null;

  async function fetchConditions() {
    try {
      const response = await fetch(`/api/conditions/${beach.id}`);
      if (!response.ok) throw new Error('Failed to fetch conditions');
      conditions = await response.json();
    } catch (error) {
      console.error('Error loading conditions:', error);
    }
  }

  onMount(fetchConditions);
  afterUpdate(fetchConditions);
</script>

<div class="surf-conditions">
  <h2>{beach.name} Surf Conditions</h2>
  {#if conditions}
    <ul>
      <li>Wave Height: {conditions.waveHeight}</li>
      <li>Wind: {conditions.windSpeed} {conditions.windDirection}</li>
      <li>Temperature: {conditions.temperature}</li>
      <li>Tide: {conditions.tide}</li>
    </ul>
  {:else}
    <p>Loading conditions...</p>
  {/if}
</div>

<style>
  .surf-conditions {
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 15px;
  }

  h2 {
    color: #0077be;
    margin-top: 0;
    font-size: 1.2em;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
    font-size: 0.9em;
  }

  @media (min-width: 768px) {
    h2 {
      font-size: 1.5em;
    }

    li {
      font-size: 1em;
    }
  }
</style>