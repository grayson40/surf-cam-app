<script lang="ts">
  import type { Beach } from '../routes/types';

  export let beach: Beach;

  const recommendedBoard: string = "Shortboard (6'2\")";
</script>

<div class="board-recommendation">
  <h2>Recommended Board for {beach.name}</h2>
  <p>{recommendedBoard}</p>
  <p>Based on current conditions, we recommend a {recommendedBoard} for optimal performance.</p>
</div>

<style>
  .board-recommendation {
    background-color: #e6f3ff;
    border-radius: 8px;
    padding: 15px;
  }

  h2 {
    color: #0077be;
    margin-top: 0;
    font-size: 1.2em;
  }

  p {
    font-size: 0.9em;
  }

  @media (min-width: 768px) {
    h2 {
      font-size: 1.5em;
    }

    p {
      font-size: 1em;
    }
  }
</style>