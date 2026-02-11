// API service layer for FlickFinda backend
import type { Movie, WatchlistItem, RatingItem, User, MovieSuggestionRequest } from '../types';

const API_BASE_URL = '';  // Same origin

class ApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw error;
    }
    return response.json();
  }

  // Auth endpoints
  async checkAuth(): Promise<{ authenticated: boolean; user?: User }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/check`);
    return this.handleResponse(response);
  }

  async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return this.handleResponse(response);
  }

  async register(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return this.handleResponse(response);
  }

  async logout(): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
    });
    return this.handleResponse(response);
  }

  async guestLogin(): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/guest`, {
      method: 'POST',
    });
    return this.handleResponse(response);
  }

  // Movie endpoints
  async getMovieSuggestion(request: MovieSuggestionRequest): Promise<{ movies: Movie[] } | { success: true; movies: Movie[] } | Movie> {
    const response = await fetch(`${API_BASE_URL}/get_movie_suggestion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async getRandomMovie(genre: string = 'Random'): Promise<{ movie: string }> {
    const response = await fetch(`${API_BASE_URL}/select_movie?genre=${encodeURIComponent(genre)}`);
    return this.handleResponse(response);
  }

  // Watchlist endpoints
  async getWatchlist(): Promise<WatchlistItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/watchlist`);
    return this.handleResponse(response);
  }

  async addToWatchlist(movieTitle: string, posterUrl: string): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/watchlist/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie_title: movieTitle, poster_url: posterUrl }),
    });
    return this.handleResponse(response);
  }

  async removeFromWatchlist(movieTitle: string): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/watchlist/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie_title: movieTitle }),
    });
    return this.handleResponse(response);
  }

  // Ratings/Watched endpoints
  async getWatchedMovies(): Promise<RatingItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/watched`);
    return this.handleResponse(response);
  }

  async addToWatched(movieTitle: string, posterUrl: string, rating: number, review: string): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/ratings/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie_title: movieTitle, poster_url: posterUrl, rating, review }),
    });
    return this.handleResponse(response);
  }

  async updateRating(id: number, rating: number, review: string): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/ratings/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, rating, review }),
    });
    return this.handleResponse(response);
  }

  async deleteRating(id: number): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/ratings/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
