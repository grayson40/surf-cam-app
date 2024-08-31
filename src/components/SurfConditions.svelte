<script lang="ts">
  import type { Beach, Conditions } from '../routes/types';

  export let beach: Beach;
  export let conditions: Conditions | null;
  export let isLoading: boolean;
</script>

<h2>{beach.name} Surf Conditions</h2>
{#if isLoading}
  <div class="loading">
    <div class="spinner"></div>
    <p>Loading conditions...</p>
  </div>
{:else if conditions}
  <div class="conditions-grid">
    <div class="condition-card">
      <span class="icon">🌊</span>
      <h3>Waves</h3>
      <p>{conditions.wave.height.min} - {conditions.wave.height.max} ft ({conditions.wave.height.humanRelation})</p>
      <p>Period: {conditions.wave.period} seconds</p>
      <p>Direction: {conditions.wave.direction}</p>
    </div>
    <div class="condition-card">
      <span class="icon">💨</span>
      <h3>Wind</h3>
      <p>{conditions.wind.speed} mph</p>
      <p>Direction: {conditions.wind.direction}</p>
    </div>
    <div class="condition-card">
      <span class="icon">🌡️</span>
      <h3>Weather</h3>
      <p>{conditions.weather.temperature}°F</p>
      <p>{conditions.weather.condition}</p>
    </div>
    <div class="condition-card">
      <span class="icon">🌊</span>
      <h3>Tides</h3>
      <p>High: {conditions.tide.high_tide} ft</p>
      <p>Low: {conditions.tide.low_tide} ft</p>
    </div>
  </div>
  <p class="timestamp">Last updated: {new Date(conditions.timestamp).toLocaleString()}</p>
{:else}
  <p>No conditions data available. Please try refreshing the page.</p>
{/if}

<style>

  h2 {
    color: #0077be;
    margin-top: 0;
    font-size: 1.5em;
    margin-bottom: 20px;
  }

  .conditions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  .condition-card {
    background-color: #f8f8f8;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    transition: transform 0.3s ease;
    flex: 1;
  }

  .condition-card:hover {
    transform: translateY(-5px);
  }

  .icon {
    font-size: 2em;
    margin-bottom: 10px;
    display: block;
  }

  h3 {
    margin: 0 0 10px 0;
    color: #333;
  }

  p {
    margin: 5px 0;
    color: #666;
  }

  .description {
    font-style: italic;
  }

  .timestamp {
    text-align: right;
    font-size: 0.8em;
    color: #999;
    margin-top: 20px;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
  }

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0077be;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .conditions-grid {
      flex-wrap: wrap;
    }

    .condition-card {
      flex-basis: calc(50% - 10px);
    }
  }

  @media (max-width: 480px) {
    .conditions-grid {
      flex-direction: column;
    }

    .condition-card {
      flex-basis: 100%;
    }
  }
</style>
