import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class RatingService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('OMDB_API_KEY')
    
    def get_movie_ratings(self, movie_title):
        ratings = {
            "Rotten Tomatoes": "N/A",
            "IMDb": "N/A",
            "Metacritic": "N/A"
        }
        
        try:
            url = f"http://www.omdbapi.com/?t={movie_title}&apikey={self.api_key}"
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                if data.get("Response") == "True":
                    ratings["IMDb"] = f"{data.get('imdbRating', 'N/A')}/10"
                    
                    for rating in data.get("Ratings", []):
                        if rating["Source"] == "Rotten Tomatoes":
                            ratings["Rotten Tomatoes"] = rating["Value"]
                        elif rating["Source"] == "Metacritic":
                            ratings["Metacritic"] = rating["Value"]
        except Exception as e:
            print(f"Error fetching ratings: {e}")
        
        return ratings
