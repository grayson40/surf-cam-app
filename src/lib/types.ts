export interface Beach {
  id: number;
  name: string;
  location_id: string;
  youtube_video_id: string;
}

export interface Post {
  id: number;
  beach_id: number;
  author: string;
  content: string;
  media_url: string | null;
  timestamp: string;
  likes: number;
  comments: number;
}

export interface Comment {
  id: number;
  post_id: number;
  content: string;
  author: string;
  timestamp: string;
}

export interface Like {
  id: number;
  post_id: number;
  user_id: number; // Assuming you have user authentication
}