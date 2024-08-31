<script lang="ts">
  import BeachCam from '../components/BeachCam.svelte';
  import SurfConditions from '../components/SurfConditions.svelte';
  import BoardRecommendation from '../components/BoardRecommendation.svelte';
  import BeachSelector from '../components/BeachSelector.svelte';
  import SocialFeed from '../components/SocialFeed.svelte';
  import type { Beach } from './types';

  let selectedBeach: Beach | null = null;

  /**
   * Handle the beach selection event
   * @param {CustomEvent<Beach>} event - Custom event containing the selected beach data
   */
  function handleBeachSelect(event: CustomEvent<Beach>) {
    selectedBeach = event.detail;
  }
</script>

<main>
  <h1>SurfSpot</h1>
  
  <BeachSelector on:select={handleBeachSelect} />
  
  {#if selectedBeach}
    <div class="beach-info">
      <div class="beach-cam-container">
        <BeachCam beach={selectedBeach} />
      </div>
      <div class="conditions-and-recommendation">
        <SurfConditions beach={selectedBeach} />
        <BoardRecommendation beach={selectedBeach} />
      </div>
    </div>
    <SocialFeed beach={selectedBeach} />
  {:else}
    <p>Select a beach to view surf conditions, recommendations, and social feed.</p>
  {/if}
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px;
    font-family: Arial, sans-serif;
  }

  h1 {
    color: #0077be;
    text-align: center;
    font-size: 1.8em;
  }

  .beach-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
  }

  .conditions-and-recommendation {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  @media (min-width: 768px) {
    main {
      padding: 20px;
    }

    h1 {
      font-size: 2.5em;
    }

    .beach-info {
      flex-direction: row;
      align-items: flex-start;
    }

    .beach-cam-container {
      flex: 2;
      max-width: 66%;
    }

    .conditions-and-recommendation {
      flex: 1;
      max-width: 33%;
    }
  }
</style>
