<script lang="ts">
  import type { Beach } from '../routes/types';

  export let beach: Beach;
  export let conditions: any;
  export let isLoading: boolean;

  console.log('conditions', conditions);
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
      <p>{conditions.surf_min[0]} - {conditions.surf_max[0]} ft</p>
      <p class="description">{conditions.surf_humanRelation[0]}</p>
    </div>
    <div class="condition-card">
      <span class="icon">💨</span>
      <h3>Wind</h3>
      <p>{conditions.speed[0]} mph</p>
      <p>Gust: {conditions.gust[0]} mph</p>
      <p>{conditions.directionType[0]} ({conditions.direction[0]}°)</p>
    </div>
    <div class="condition-card">
      <span class="icon">🌡️</span>
      <h3>Weather</h3>
      <p>{conditions.temperature[0]}°F</p>
      <p>{conditions.pressure[0]} hPa</p>
      <p>Condition: {conditions.condition[0]}</p>
    </div>
    <div class="condition-card">
      <span class="icon">🌊</span>
      <h3>Swell</h3>
      <p>{conditions.swells_0_height[0]} ft</p>
      <p>{conditions.swells_0_period[0]} seconds</p>
      <p>{conditions.swells_0_direction[0]}°</p>
    </div>
  </div>
  <p class="timestamp">Last updated: {new Date(conditions.timestamp_dt[0]).toLocaleString()}</p>
{:else}
  <div class="loading">
    <div class="spinner"></div>
    <p>Loading conditions...</p>
  </div>
{/if}

<style>

  h2 {
    color: #0077be;
    margin-top: 0;
    font-size: 1.5em;
    margin-bottom: 20px;
  }

  .conditions-grid {
    display: flex;
    justify-content: space-between;
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
