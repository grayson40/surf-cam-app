<script lang="ts">
  import type { Beach, Conditions } from '../routes/types';

  export let beach: Beach;
  export let conditions: Conditions | null;
  export let isLoading: boolean;

  $: recommendedBoard = determineRecommendedBoard(conditions);

  function determineRecommendedBoard(conditions: Conditions | null): string {
    if (!conditions) return "Unable to determine recommendation.";

    const { wave, wind } = conditions;

    if (wave.height < 3) {
      return "Longboard (9'0\")";
    } else if (wave.height >= 3 && wave.height < 5) {
      return "Funboard (7'6\")";
    } else if (wave.height >= 5 && wave.height < 8) {
      return "Shortboard (6'2\")";
    } else {
      return "Gun (7'6\" or longer)";
    }
  }
</script>

<h2>Recommended Board for {beach.name}</h2>
{#if isLoading}
  <div class="loading">
    <div class="spinner"></div>
    <p>Analyzing conditions...</p>
  </div>
{:else if conditions}
  <div class="recommendation">
    <p class="board">{recommendedBoard}</p>
    <p class="description">Based on current conditions with wave height of {conditions.wave.height} ft, we recommend a {recommendedBoard.toLowerCase()} for optimal performance.</p>
  </div>
{:else}
  <p class="error">Unable to determine recommendation. Please try again later.</p>
{/if}

<style>
  h2 {
    color: #0077be;
    font-size: 1.5em;
    margin-top: 0;
    margin-bottom: 20px;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;
  }

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0077be;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .recommendation {
    background-color: #f0f8ff;
    border-radius: 8px;
    padding: 15px;
  }

  .board {
    font-size: 1.2em;
    font-weight: bold;
    color: #0077be;
    margin-bottom: 10px;
  }

  .description {
    color: #333;
    line-height: 1.4;
  }

  .error {
    color: #d9534f;
    font-style: italic;
  }
</style>