export interface Beach {
  id: number;
  name: string;
  camUrl: string;
  youtubeVideoId: string;
}

export interface Conditions {
  waveHeight: string;
  windSpeed: string;
  windDirection: string;
  temperature: string;
  tide: string;
}

export interface Post {
  id: number;
  author: string;
  content: string;
  mediaUrl?: string;
  captionsUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
}