<script lang="ts">
  import { onMount } from 'svelte';
  import type { Beach } from '../routes/types';

  export let beach: Beach;

  let videoElement: HTMLVideoElement;

  onMount(() => {
    if (videoElement) {
      videoElement.src = `https://www.youtube.com/embed/${beach.youtube_video_id}?autoplay=1&mute=1&enablejsapi=1`;
    }
  });
</script>

<div class="beach-cam">
  <h2>{beach.name} Live Cam</h2>
  <div class="cam-container">
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${beach.youtube_video_id}?autoplay=1&mute=1&enablejsapi=1`}
      title="{beach.name} live cam"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</div>

<style>
  .beach-cam {
    background-color: #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
  }

  h2 {
    padding: 10px;
    margin: 0;
    background-color: #0077be;
    color: white;
    font-size: 1.2em;
  }

  .cam-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  @media (min-width: 768px) {
    h2 {
      font-size: 1.5em;
    }
  }
</style>