export interface Beach {
  id: number;
  name: string;
  location_id: string;
  youtube_video_id: string;
}

export interface Conditions {
  wave: WaveCondition;
  wind: WindCondition;
  tide: TideCondition;
  weather: WeatherCondition;
  timestamp: string;
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

export interface WaveCondition {
  height: {
    min: number;
    max: number;
    avg: number;
    humanRelation: string;
  };
  period: number;
  direction: string;
}

export interface WindCondition {
  speed: number;
  direction: string;
}

export interface TideCondition {
  high_tide: number;
  low_tide: number;
}

export interface WeatherCondition {
  temperature: number;
  condition: string;
}