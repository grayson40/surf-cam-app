export interface Beach {
  id: number;
  name: string;
  location_id: string;
  youtube_video_id: string;
}

export interface Conditions {
  wave_height: string;
  wind_speed: string;
  wind_direction: string;
  temperature: string;
  tide: string;
}

export interface Post {
  id: number;
  author: string;
  content: string;
  media_url?: string;
  captions_url?: string;
  timestamp: string;
  likes: number;
  comments: number;
}