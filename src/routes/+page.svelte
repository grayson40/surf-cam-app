<script lang="ts">
  import { onMount } from 'svelte';
  import type { Beach, Conditions } from './types';
  import BeachSelector from '../components/BeachSelector.svelte';
  import BeachCam from '../components/BeachCam.svelte';
  import SurfConditions from '../components/SurfConditions.svelte';
  import BoardRecommendation from '../components/BoardRecommendation.svelte';
  import SocialFeed from '../components/SocialFeed.svelte';

  let selectedBeach: Beach | null = null;
  let conditions: any = null;
  let isLoading = false;

  async function handleBeachSelect(event: CustomEvent<Beach>) {
    selectedBeach = event.detail;
    await fetchConditions(selectedBeach);
  }

  async function fetchConditions(beach: Beach) {
    if (!beach) return;
    isLoading = true;
    conditions = null;
    try {
      const response = await fetch(`/api/conditions?beachId=${beach.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conditions');
      }
      conditions = await response.json();
      console.log('Conditions after fetch:', conditions);
    } catch (error) {
      console.error('Error loading conditions:', error);
    } finally {
      isLoading = false;
    }
  }
</script>

<main>
  <header>
    <h1>Simply Surf</h1>
    <BeachSelector on:select={handleBeachSelect} />
  </header>

  {#if selectedBeach}
    <div class="content">
      <div class="main-column">
        <section class="video-section">
          <BeachCam beach={selectedBeach} />
        </section>
        <section class="conditions-section">
          <SurfConditions beach={selectedBeach} {conditions} {isLoading} />
        </section>
      </div>
      <div class="side-column">
        <section class="board-recommendation-section">
          <BoardRecommendation beach={selectedBeach} {conditions} {isLoading} />
        </section>
        <section class="social-feed-section">
          <SocialFeed beach={selectedBeach} />
        </section>
      </div>
    </div>
  {:else}
    <p class="select-prompt">Please select a beach to view its information.</p>
  {/if}
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #f0f8ff;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  h1 {
    color: #0077be;
    font-size: 2.5em;
    margin: 0;
  }

  .content {
    display: flex;
    gap: 20px;
  }

  .main-column {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .side-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  section {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .select-prompt {
    text-align: center;
    font-size: 1.2em;
    color: #555;
    margin-top: 50px;
  }

  .loading {
    text-align: center;
    font-size: 1.2em;
    color: #555;
    margin-top: 50px;
  }

  @media (max-width: 1024px) {
    header {
      flex-direction: column;
      align-items: stretch;
    }

    h1 {
      margin-bottom: 20px;
    }

    .content {
      flex-direction: column;
    }

    .main-column, .side-column {
      width: 100%;
    }
  }
</style>
