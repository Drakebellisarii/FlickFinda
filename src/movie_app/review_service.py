import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ReviewService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('OMDB_API_KEY')
    
    def get_web_reviews(self, movie_title):
        try:
            url = f"http://www.omdbapi.com/?t={movie_title}&plot=full&apikey={self.api_key}"
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                if data.get("Response") == "True":
                    reviews = []
                    if data.get("Plot"):
                        reviews.append(f"Plot Summary:\n{data['Plot']}\n")
                    if data.get("Awards"):
                        reviews.append(f"\nAwards:\n{data['Awards']}\n")
                    return "\n".join(reviews)
            return "No reviews available."
        except Exception as e:
            return f"Error fetching web reviews: {str(e)}"

    def get_ai_review(self, movie_title):
        try:
            url = "http://localhost:11434/api/generate"
            headers = {"Content-Type": "application/json"}
            data = {
                "model": "llama2",
                "prompt": f"Write a brief, engaging 3-sentence summary of the movie '{movie_title}'",
                "stream": False
            }
            response = requests.post(url, headers=headers, json=data)
            response_json = response.json()
            return response_json['response']
        except Exception as e:
            return f"Error getting AI review: {str(e)}"
