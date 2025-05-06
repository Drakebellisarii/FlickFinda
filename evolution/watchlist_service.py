from flask import Flask, request, jsonify
import sqlite3
import requests

app = Flask(__name__)
TMDB_API_KEY = "99e18f90bcfd0da160dee307245646fa"

# Database setup
conn = sqlite3.connect('watchlist.db', check_same_thread=False)
cursor = conn.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS watchlist (id INTEGER PRIMARY KEY, user TEXT, movie TEXT)''')
conn.commit()

@app.route('/add_to_watchlist', methods=['POST'])
def add_to_watchlist():
    data = request.json
    user = data.get('user')
    movie = data.get('movie')
    
    cursor.execute("INSERT INTO watchlist (user, movie) VALUES (?, ?)", (user, movie))
    conn.commit()
    
    return jsonify({"message": f"{movie} added to {user}'s watchlist"}), 201

@app.route('/get_watchlist/<user>', methods=['GET'])
def get_watchlist(user):
    cursor.execute("SELECT movie FROM watchlist WHERE user = ?", (user,))
    movies = [row[0] for row in cursor.fetchall()]
    return jsonify({"watchlist": movies})

@app.route('/check_streaming/<movie>', methods=['GET'])
def check_streaming(movie):
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={movie}"
    response = requests.get(url).json()
    
    if response["results"]:
        movie_id = response["results"][0]["id"]
        details_url = f"https://api.themoviedb.org/3/movie/{movie_id}/watch/providers?api_key={TMDB_API_KEY}"
        details_response = requests.get(details_url).json()
        
        if "results" in details_response and "US" in details_response["results"]:
            providers = details_response["results"]["US"]["flatrate"]
            provider_names = [p["provider_name"] for p in providers] if providers else ["Not available"]
            return jsonify({"streaming_on": provider_names})
    
    return jsonify({"streaming_on": "Not available"})

if __name__ == '__main__':
    app.run(debug=True)