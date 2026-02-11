// Type definitions for the FlickFinda API
export interface Movie {
  title: string;
  reviews: string;
  awards: string;
  poster: string;
  ratings: {
    imdb: string;
    'rotten tomatoes': string;
    metacritic: string;
  };
  released: string;
  actors: string;
  director: string;
  genre: string;
  runtime: string;
  year: string;
  trailer_url: string;
}

export interface WatchlistItem {
  id: number;
  movie_title: string;
  poster_url: string;
  added_date: string;
}

export interface RatingItem {
  id: number;
  movie_title: string;
  poster_url: string;
  review: string;
  rating: number;
  added_date: string;
}

export interface User {
  id: number;
  username: string;
  is_guest: boolean;
}

export interface MovieSuggestionRequest {
  description: string;
  num_titles: number;
  streaming_service: string;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: string;
}
