import requests
import tkinter as tk
from tkinter import ttk, messagebox
import tkinterweb
import requests

class TrailerService:
    def __init__(self):
        self.omdb_key = "4b9e10c0"  # Using the same OMDB API key
        
    def get_trailer_url(self, movie_title):
        try:
            # Get movie data from OMDB
            url = f"http://www.omdbapi.com/?t={movie_title}&apikey={self.omdb_key}"
            response = requests.get(url)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("Response") == "True":
                    # Extract IMDB ID
                    imdb_id = data.get("imdbID")
                    if imdb_id:
                        # Return IMDB trailer embed URL
                        return f"https://www.imdb.com/video/imdb/{imdb_id}/imdb/embed"
            
            return None
            
        except Exception as e:
            print(f"Error fetching trailer: {e}")
            return None