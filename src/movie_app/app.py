from flask import Flask, render_template, jsonify, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from openai import OpenAI
import os
import random
import requests 
import traceback
import re
from flask_migrate import Migrate
from os import environ
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
from flask import session
import urllib.parse


app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Get API keys from environment variables
OMDB_API_KEY = os.getenv('OMDB_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

app.secret_key = secrets.token_hex(16)

# Database setup
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'instance', 'movies.db')
os.makedirs(os.path.dirname(db_path), exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db) 

# Define all your classes (ReviewService, RatingService, MovieDataService, etc.)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    # Define relationships with other models
    watchlist_items = db.relationship('WatchlistItem', backref='user', lazy=True)
    ratings = db.relationship('MovieRating', backref='user', lazy=True)

    
class ReviewService:
    def __init__(self, OMDB_API_KEY):
        self.API_KEY = OMDB_API_KEY
    
    def get_web_reviews(self, movie_title):
        try:
            url = f"http://www.omdbapi.com/?t={movie_title}&plot=full&apikey={self.API_KEY}"
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
                            
class RatingService:
    def __init__(self, OMDB_API_KEY):
        self.API_KEY = OMDB_API_KEY
    
    def get_movie_ratings(self, movie_title):
        ratings = {
            "Rotten Tomatoes": "N/A",
            "IMDb": "N/A",
            "Metacritic": "N/A"
        }
    
        try:
            url = f"http://www.omdbapi.com/?t={movie_title}&apikey={self.API_KEY}"
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                print(f"API response data: {data}")  # Debugging line
                if data.get("Response") == "True":
                    imdb_rating = data.get('imdbRating', 'N/A')
                    print(f"IMDb rating from API: {imdb_rating}")  # Debugging line
                
                    if imdb_rating != 'N/A':
                        ratings["IMDb"] = f"{imdb_rating}/10"
                    else:
                        print("IMDb rating not found.")  # Debugging line

                    for rating in data.get("Ratings", []):
                        if rating["Source"] == "Rotten Tomatoes":
                            ratings["Rotten Tomatoes"] = rating["Value"]
                        elif rating["Source"] == "Metacritic":
                            ratings["Metacritic"] = rating["Value"]
                else:
                    print(f"Error: {data.get('Error', 'Unknown error')}")
            else:
                print(f"Error: Received status code {response.status_code}")
        except Exception as e:
            print(f"Error fetching ratings: {e}")
    
        return ratings

class MovieRating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_title = db.Column(db.String(200), nullable=False)
    poster_url = db.Column(db.String(500))
    review = db.Column(db.Text)
    rating = db.Column(db.Integer)
    # User relationship
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', name='fk_rating_user_id'), nullable=False)
    
    # Unique constraint - each user can only rate a movie once
    __table_args__ = (
        db.UniqueConstraint('user_id', 'movie_title', name='uq_user_movie_rating'),
    )

# Modify your existing models to include user_id
class WatchlistItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_title = db.Column(db.String(200), nullable=False)
    poster_url = db.Column(db.String(500))
    added_date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    # User relationship
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', name='fk_watchlist_user_id'), nullable=False)
    
    # Unique constraint - each user can only add a movie once
    __table_args__ = (
        db.UniqueConstraint('user_id', 'movie_title', name='uq_user_movie_watchlist'),
    )

@app.route('/api/ratings/update', methods=['POST'])
def update_rating():
    try:
        data = request.get_json()
        movie_id = data.get('id')
        review = data.get('review')
        rating = data.get('rating')
        
        movie = MovieRating.query.get(movie_id)
        if not movie:
            return jsonify({'message': 'Movie not found', 'success': False}), 404
        
        movie.review = review
        movie.rating = rating
        db.session.commit()
        
        return jsonify({'message': 'Review updated', 'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error: {str(e)}', 'success': False}), 500

class MovieDataService:
    def get_random_movie(self):
        return random.choice(["The Babadook","Gerald's Game", "There's Someone Inside Your House", "The platform", "Mr. Harrigan's phone",
                "Berlin syndrome", "Army of the dead", "the babysitter: killer queen", "Fear street part one", "A classic horror story",
                "1922", "the conjuring", "Death note", "In the tall grass", "Bird box", "The ritual",  "Always be my maybe", "Somethings gotta give", "set it up", "No hard feelings", "Persuasion", "Look both ways", "Love and leashes", "The half of it",
                "Someone great", "plus one", "He's all that", "Desperados", "Nappily Ever After", "Good on paper", "My Best Friend's Wedding", "The Incredible Jessica James",
                "Sierra Burgess is a loser", "Anyone but you", "players", "The perfect find", "Set it up", "Alex Strangelove", "Love hard", "Love in the villa",
                "To all the boys I've loved before", "Superbad","The other guys", "Hustle", "We have a ghost", "Bad trip", "Between two ferns: the movie", "Set it up",
                "Dolemite is my name", "The Ballad of Buster scruggs", "Unfrosted", "Leo", "Do Revenge", "I care a lot",
                "Red notice", "Spenser confidential", "The laundromat", "The Meyerowitz stories", "The Breaker Upperers", "Me time", "Old dads",
                "Dumb money", "Hustle", "The package", "Our Planet", "13th", "The Social Dilemma", "Making a Murderer", "My Octopus Teacher", "Wild Wild Country","Tiger King","Inside Bill's Brain: Decoding Bill Gates",
                "Crip Camp", "American Factory", "Seaspiracy", "Night on Earth", "David Attenborough: A Life on Our Planet", "The Tinder Swindler",
                "Conversations with a Killer: The Ted Bundy Tapes", "The Great Hack", "Abducted in Plain Sight", "The Pharmacist", "Icarus", "Knock Down the House", "Homecoming: A Film by Beyoncé", "The Innocent Man",
                "Don't F**k with Cats: Hunting an Internet Killer", "Cocaine Cowboys: The Kings of Miami", "Chef's Table", "Rotten", "Explained", "Break Point", "Untold: The Girlfriend Who Didn't Exist", "Down to Earth with Zac Efron",
                "Fantastic Fungi", "Chasing Coral"])
    

    def get_random_movie_from_genre(self, genre):
        genre_movies = {
            "Horror": ["The Babadook","Gerald's Game", "There's Someone Inside Your House", "The platform", "Mr. Harrigan's phone",
                "Berlin syndrome", "Texas Chainsaw Massacre", "Army of the dead", "the babysitter: killer queen", "Fear street part one", "A classic horror story",
                "1922", "the conjuring", "Death note", "In the tall grass", "Bird box", "The ritual"],
            "romCom": ["Always be my maybe", "Somethings gotta give", "set it up", "No hard feelings", "Persuasion", "Look both ways", "Love and leashes", "The half of it",
                "Someone great", "plus one", "He's all that", "Desperados", "Nappily Ever After", "Good on paper", "My Best Friend's Wedding", "The incredible jessica james",
                "Sierra Burgess is a loser", "Anyone but you", "players", "The perfect find", "Set it up", "Alex Strangelove", "Love hard", "Love in the villa",
                "To all the boys I've loved before"],
            "Comedy": ["Superbad", "Anchorman: The Legend of Ron Burgndy", "The other guys", "Hustle", "We have a ghost", "Bad trip", "Between two ferns: the movie", "Set it up",
                "Dolemite is my name", "The Ballad of Buster scruggs", "Unfrosted", "Leo", "Do revenege", "Glass Onion: A Knives Out Mystery", "I care a lot",
                "Red notice", "Spenser confidential", "The laundromat", "The Meyerowitz stories", "The breaker uppers", "Me time", "Old dads",
                "Dumb money", "Hustle", "The package"],
            "Documentary": ["Our Planet", "13th", "The Social Dilemma", "Making a Murderer", "My Octopus Teacher", "Wild Wild Country","Tiger King","Inside Bill's Brain: Decoding Bill Gates",
                "Crip Camp", "American Factory", "Seaspiracy", "Night on Earth", "Fyre: The Greatest Party That Never Happened", "David Attenborough: A Life on Our Planet", "The Tinder Swindler",
                "Conversations with a Killer: The Ted Bundy Tapes", "The Great Hack", "Abducted in Plain Sight", "The Pharmacist", "Icarus", "Knock Down the House", "Homecoming: A Film by Beyoncé", "The Innocent Man",
                "Don't F**k with Cats: Hunting an Internet Killer", "Cocaine Cowboys: The Kings of Miami", "Chef's Table", "Rotten", "Explained", "Break Point", "Untold: The Girlfriend Who Didn't Exist", "Down to Earth with Zac Efron",
                "Fantastic Fungi", "Chasing Coral"],
            "Christmas": ["Home Alone", "Home Alone 2: Lost in New York", "Elf", "A Christmas Story", "It's a Wonderful Life", "National Lampoon's Christmas Vacation","The Polar Express","How the Grinch Stole Christmas (2000)", "Dr. Seuss' The Grinch (2018)", 
             "Miracle on 34th Street (1994)", "The Santa Clause","Love Actually","The Holiday","Arthur Christmas","Klaus","Scrooged","A Charlie Brown Christmas","Rudolph the Red-Nosed Reindeer","Frosty the Snowman","White Christmas",
             "Jingle All the Way","The Nightmare Before Christmas","Bad Santa","Noelle"]
        }
        return random.choice(genre_movies.get(genre, []))

movie_data_service = MovieDataService()
review_service = ReviewService(OMDB_API_KEY)
rating_service = RatingService(OMDB_API_KEY)

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        # Basic validation
        if not username or not password:
            return jsonify({'success': False, 'message': 'Username and password are required'}), 400
            
        # Check if username already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'success': False, 'message': 'Username already exists'}), 400
            
        # Hash the password
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        
        # Create new user
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        
        # Set up session
        session['user_id'] = new_user.id
        session['username'] = new_user.username
        
        return jsonify({
            'success': True, 
            'message': 'Registration successful',
            'user': {
                'id': new_user.id,
                'username': new_user.username
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        # Find user by username
        user = User.query.filter_by(username=username).first()
        
        # Debug log
        print(f"Login attempt for {username}")
        
        # Check if user exists and password is correct
        if not user or not check_password_hash(user.password, password):
            return jsonify({'success': False, 'message': 'Invalid username or password'}), 401
            
        # Set up session - ADD THESE EXPLICIT PRINTS
        print(f"Setting session for user_id: {user.id}")
        session['user_id'] = user.id
        session['username'] = user.username
        print(f"Session after setting: {session}")
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username
            }
        }), 200
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500
        
    
@app.route('/api/auth/logout', methods=['POST'])
def logout():
    # Clear session
    session.pop('user_id', None)
    session.pop('username', None)
    return jsonify({'success': True, 'message': 'Logout successful'}), 200

@app.route('/api/auth/check', methods=['GET'])
def check_auth():
    if 'user_id' in session and 'username' in session:
        return jsonify({
            'authenticated': True,
            'user': {
                'id': session['user_id'],
                'username': session['username']
            }
        }), 200
    return jsonify({'authenticated': False}), 200

# Helper function to check if user is logged in
def get_current_user_id():
    return session.get('user_id')

# Update your existing endpoint handlers to use the current user
@app.route('/api/watchlist/add', methods=['POST'])
def add_to_watchlist():
    try:
        # Get current user
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
            
        data = request.get_json()
        movie_title = data.get('title')
        poster_url = data.get('poster')
        
        # Check if movie already exists in user's watchlist
        existing_item = WatchlistItem.query.filter_by(user_id=user_id, movie_title=movie_title).first()
        if existing_item:
            return jsonify({'success': False, 'message': 'Movie already in watchlist'}), 400
            
        new_item = WatchlistItem(
            movie_title=movie_title,
            poster_url=poster_url,
            user_id=user_id
        )
        db.session.add(new_item)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Added to watchlist'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error adding to watchlist: {str(e)}")
        return jsonify({'success': False, 'message': f'Error adding to watchlist: {str(e)}'}), 500

@app.route('/api/watchlist', methods=['GET'])
def get_watchlist():
    try:
        # Get current user
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
            
        items = WatchlistItem.query.filter_by(user_id=user_id).order_by(WatchlistItem.added_date.desc()).all()
        watchlist = [{
            'id': item.id,
            'title': item.movie_title,
            'poster': item.poster_url,
            'added_date': item.added_date.isoformat()
        } for item in items]
        
        return jsonify({'success': True, 'watchlist': watchlist})
    except Exception as e:
        print(f"Error fetching watchlist: {str(e)}")
        return jsonify({'success': False, 'message': f'Error fetching watchlist: {str(e)}'}), 500

@app.route('/api/watchlist/remove', methods=['POST'])
def remove_from_watchlist():
    try:
        # Get current user
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
            
        data = request.get_json()
        movie_id = data.get('id')
        
        item = WatchlistItem.query.filter_by(id=movie_id, user_id=user_id).first()
        if not item:
            return jsonify({'success': False, 'message': 'Movie not found in watchlist'}), 404
            
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Removed from watchlist'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error removing from watchlist: {str(e)}")
        return jsonify({'success': False, 'message': f'Error removing from watchlist: {str(e)}'}), 500

@app.route('/api/ratings/add', methods=['POST'])
def add_to_ratings():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'You must be logged in to rate movies'})
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'})
        
        title = data.get('title')
        poster = data.get('poster')
        
        if not title:
            return jsonify({'success': False, 'message': 'Movie title is required'})
        
        user_id = session['user_id']
        
        # Try to find the existing record
        existing_rating = MovieRating.query.filter_by(
            user_id=user_id, 
            movie_title=title
        ).first()
        
        if existing_rating:
            # Movie already in the database, no need to add it
            print(f"Movie '{title}' already exists for user {user_id}")
            return jsonify({'success': True, 'message': 'Movie is already in your watched list'})
        else:
            # Movie doesn't exist yet, create it
            try:
                new_rating = MovieRating(
                    movie_title=title,
                    poster_url=poster,
                    user_id=user_id
                )
                db.session.add(new_rating)
                db.session.flush()  # This will detect constraint violations before commit
                db.session.commit()
                print(f"Added movie '{title}' to watched list for user {user_id}")
                return jsonify({'success': True, 'message': 'Movie added successfully'})
            except Exception as inner_e:
                db.session.rollback()
                # If there's a constraint error, someone else might have added it
                # in the meantime, so let's check again
                if "UNIQUE constraint failed" in str(inner_e):
                    print(f"Race condition detected for movie '{title}', user {user_id}")
                    return jsonify({'success': True, 'message': 'Movie is already in your watched list'})
                else:
                    raise inner_e  # Re-raise if it's a different error
    
    except Exception as e:
        db.session.rollback()
        print(f"Error in add_to_ratings: {str(e)}")
        # Return success anyway since the client seems to be proceeding
        return jsonify({'success': True, 'message': 'Action processed'})
    

@app.route('/api/watched', methods=['GET'])
def get_watched_movies():
    try:
        # Get current user
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
            
        movies = MovieRating.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'success': True,
            'watched_movies': [{
                'id': m.id,
                'title': m.movie_title,
                'poster_url': m.poster_url,
                'review': m.review,
                'rating': m.rating
            } for m in movies]
        })
    except Exception as e:
        print(f"Error in get_watched_movies: {str(e)}")
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

@app.route('/')
def index():
    print("Session data:", session)  # Debug print
    
    # Get API keys from environment variables
    youtube_api_key = os.environ.get('YOUTUBE_API_KEY')
    omdb_api_key = os.environ.get('OMDB_API_KEY')
    
    if 'user_id' in session:
        print(f"User ID in session: {session['user_id']}")
        return render_template('index.html', 
                             youtube_api_key=youtube_api_key,
                             omdb_api_key=omdb_api_key)
    elif 'is_guest' in session:
        print("Guest session detected")
        # Pass both API keys to the template
        return render_template('index.html', 
                             youtube_api_key=youtube_api_key,
                             omdb_api_key=omdb_api_key)
    else:
        print("No session data, showing login page")
        return render_template('login.html')
    

@app.route('/ratings')
def ratings_page():
    return render_template('ratings.html')

# Helper function to get current user ID
def get_current_user_id():
    return session.get('user_id')

def get_movie_data(movie_title):
    try:
        url = f"http://www.omdbapi.com/?t={movie_title}&plot=full&apikey={OMDB_API_KEY}"
        response = requests.get(url, timeout=10) 
        response.raise_for_status() 
        data = response.json()
        if data.get("Response") == "True":
            return (
                data.get("Plot", "No plot available."),
                data.get("Awards", "No awards available."),
                data.get("Ratings", {}),
                data.get("Poster", "No poster available.")
            )
        else:
            return None, None, None, None
    except requests.RequestException as e:
        print(f"Error fetching movie data: {e}")
        return None, None, None, None

@app.route('/select_movie', methods=['GET'])
def select_movie():
    genre = request.args.get('genre', 'Random')
    if genre == 'Random':
        movie = movie_data_service.get_random_movie()
    else:
        movie = movie_data_service.get_random_movie_from_genre(genre)
    return jsonify({'movie': movie})

@app.route('/select_movies', methods=['GET'])
def select_movies():
    genre = request.args.get('genre', 'Random')
    if genre == 'Random':
        movie_titles = [movie_data_service.get_random_movie() for _ in range(5)] 
        movies = [{"title": title, "poster": get_movie_data(title)[3]} for title in movie_titles]
    else:
        movie_titles = movie_data_service.get_random_movie_from_genre(genre)  # Get 8 from the genre
        movies = [{"title": title, "poster": get_movie_data(title)[3]} for title in movie_titles]
    return jsonify({'movies': movies})

@app.route('/get_reviews_and_ratings', methods=['GET'])
def get_reviews_and_ratings():
    movie = request.args.get('movie')
    if movie:
        try:
            url = f"http://www.omdbapi.com/?t={movie}&plot=full&apikey=4b9e10c0"
            response = requests.get(url)
            data = response.json()
            
            if data.get("Response") == "True":
                # Format ratings consistently
                ratings_dict = {
                    'IMDb': f"{data.get('imdbRating', 'N/A')}/10",
                    'Rotten Tomatoes': 'N/A',
                    'Metacritic': 'N/A'
                }
                
                # Process Ratings array
                for rating in data.get("Ratings", []):
                    if rating["Source"] == "Rotten Tomatoes":
                        ratings_dict["Rotten Tomatoes"] = rating["Value"]
                    elif rating["Source"] == "Metacritic":
                        ratings_dict["Metacritic"] = rating["Value"]
                
                return jsonify({
                    'reviews': data.get("Plot", "No plot available."),
                    'ratings': ratings_dict,
                    'awards': data.get("Awards", "No awards information available."),
                    'poster': data.get("Poster", "N/A")
                })
            return jsonify({'error': 'Movie not found'})
        except Exception as e:
            print(f"Error fetching movie data: {e}")
            return jsonify({'error': str(e)})
    return jsonify({'error': 'No movie provided'})

@app.route('/watchlist')
def watchlist():
    return render_template('watchlist.html')

@app.route('/get_trailer', methods=['GET'])
def get_trailer():
    movie = request.args.get('movie')
    if movie:
        try:
            # Create a safer URL-friendly query
            query = f"{movie.strip()} official trailer"
            encoded_query = urllib.parse.quote_plus(query)
            youtube_search_url = f"https://www.youtube.com/results?search_query={encoded_query}"
            
            print(f"Movie trailer for {movie} can be found here: {youtube_search_url}")
            
            # You could also implement the search directly here using the YouTube API
            # and return the first video ID, which would be more reliable than
            # just returning a search URL
            
            return jsonify({
                'success': True,
                'trailer_url': youtube_search_url
            })
        except Exception as e:
            print(f"Error fetching trailer: {str(e)}")
            return jsonify({
                'success': False,
                'error': f'Error fetching trailer: {str(e)}'
            }), 500
    else:
        return jsonify({
            'success': False,
            'error': 'No movie specified'
        }), 400

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_movie_list(description, num_titles=5):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a movie reviewing and recommending expert."},
                {"role": "user", "content": f"Suggest any {num_titles} movie titles that match this description: {description}. Only include titles separated by commas, no numbers or additional details."}
            ],
            max_tokens=150,
            temperature=0.2
        )

        content = response.choices[0].message.content.strip()
        movies = [movie.strip() for movie in content.split(',')]

        return {
            "titles": movies[:num_titles],
            "success": True
        }

    except Exception as e:
        print(f"Error generating movie suggestion: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

# Add this route for the placeholder image
#@app.route('/api/placeholder/<width>/<height>')
def placeholder(width, height):
    return redirect(f"https://via.placeholder.com/{width}x{height}")

@app.route('/get_movie_suggestion', methods=['POST'])
def get_movie_suggestion():
    try:
        data = request.get_json()
        user_description = data.get("description", "")
        num_titles = int(data.get("num_titles", 1))  # Default to 1 if not specified
        
        # Validate input
        if not user_description:
            return jsonify({'error': 'No description provided'}), 400
            
        # Limit to reasonable range
        if num_titles < 1:
            num_titles = 1
        elif num_titles > 6:  # Match your dropdown max
            num_titles = 6
            
        print(f"Generating {num_titles} movie suggestions for: {user_description}")
            
        result = generate_movie_list(user_description, num_titles)
        
        if not result["success"]:
            return jsonify({'error': 'Failed to generate movie suggestions'}), 500
            
        # Get the movies from the result
        suggested_movies = result["titles"]
        print(f"Generated movies: {suggested_movies}")
        
        # If we want multiple movies, return them all with complete info
        if num_titles > 1:
            movie_results = []
            for movie_title in suggested_movies:
                reviews, awards, ratings, poster = get_movie_data(movie_title)
                
                # Create a ratings dictionary for this movie
                ratings_dict = {}
                if isinstance(ratings, list):
                    ratings_dict = {r.get("Source", "Unknown"): r.get("Value", "N/A") for r in ratings if isinstance(r, dict)}
                
                movie_results.append({
                    'title': movie_title,
                    'reviews': reviews or "No reviews available",
                    'awards': awards or "No awards information available",
                    'poster': poster or "/api/placeholder/300/450",
                    'ratings': {
                        'imdb': ratings_dict.get('IMDb', 'N/A') if ratings else 'N/A',
                        'rotten tomatoes': ratings_dict.get('Rotten Tomatoes', 'N/A') if ratings else 'N/A',
                        'metacritic': ratings_dict.get('Metacritic', 'N/A') if ratings else 'N/A'
                    },
                    'trailer_url': f"https://www.youtube.com/results?search_query={movie_title} trailer"
                })
            
            return jsonify({
                'success': True,
                'movies': movie_results
            })
        else:
            # Single movie case - keep original behavior but ensure consistent data structure
            selected_movie = suggested_movies[0]
            reviews, awards, ratings, poster = get_movie_data(selected_movie)
            
            # Ensure ratings is a dictionary
            ratings_dict = {}
            if isinstance(ratings, list):
                ratings_dict = {r.get("Source", "Unknown"): r.get("Value", "N/A") for r in ratings if isinstance(r, dict)}
            
            response_data = {
                'title': selected_movie,
                'reviews': reviews or "Sorry no reviews Available",
                'ratings': {
                    'imdb': ratings_dict.get('IMDb', 'N/A') if ratings else 'N/A',
                    'rotten tomatoes': ratings_dict.get('Rotten Tomatoes', 'N/A') if ratings else 'N/A',
                    'metacritic': ratings_dict.get('Metacritic', 'N/A') if ratings else 'N/A'
                },
                'awards': awards or "Could not find any award information",
                'poster': poster or "https://example.com/popcorn-movie.jpg/300x450",
                'trailer_url': f"https://www.youtube.com/results?search_query={selected_movie} trailer"
            }
            
            return jsonify(response_data)
            
    except Exception as e:
        print(f"Error in get_movie_suggestion: {str(e)}")
        print(traceback.format_exc())  # Print full error traceback
        return jsonify({
            'error': str(e),
            'details': traceback.format_exc()
        }), 500


@app.route('/debug')
def debug_route():
    """Basic debug route to test templates and sessions"""
    result = {
        'session': dict(session),
        'authenticated': 'user_id' in session,
        'user_id': session.get('user_id'),
        'username': session.get('username'),
        'templates_folder': app.template_folder,
        'index_exists': os.path.exists(os.path.join(app.template_folder, 'index.html')) if app.template_folder else False,
        'login_exists': os.path.exists(os.path.join(app.template_folder, 'login.html')) if app.template_folder else False
    }
    
    # Return as HTML for easy viewing
    html = f"""
    <html>
    <head><title>Debug Info</title></head>
    <body>
        <h1>Flask App Debug Info</h1>
        <ul>
            <li>Session: {result['session']}</li>
            <li>Authenticated: {result['authenticated']}</li>
            <li>User ID: {result['user_id']}</li>
            <li>Username: {result['username']}</li>
            <li>Templates folder: {result['templates_folder']}</li>
            <li>index.html exists: {result['index_exists']}</li>
            <li>login.html exists: {result['login_exists']}</li>
        </ul>
        <form method="post" action="/api/auth/logout">
            <button type="submit">Logout</button>
        </form>
        <br>
        <a href="/">Go to homepage</a>
    </body>
    </html>
    """
    return html

@app.route('/test-login')
def test_login():
    # Set a test user in session
    session['user_id'] = 1
    session['username'] = 'testuser'
    
    return """
    <html>
    <head><title>Test Login</title></head>
    <body>
        <h1>Test login successful</h1>
        <p>Session has been set</p>
        <p><a href="/">Go to homepage</a></p>
        <p><a href="/debug">Check debug info</a></p>
    </body>
    </html>
    """

@app.route('/api/ratings/delete', methods=['POST'])
def delete_rating():
    try:
        data = request.get_json()
        movie_id = data.get('id')
        
        if not movie_id:
            return jsonify({'success': False, 'message': 'No movie ID provided'}), 400
            
        print(f"Attempting to delete movie with ID: {movie_id}")
        
        # Find the movie by ID
        movie = MovieRating.query.get(movie_id)
        
        if not movie:
            print(f"Movie with ID {movie_id} not found")
            return jsonify({'success': False, 'message': 'Movie not found'}), 404
        
        # Log the movie we're about to delete
        print(f"Deleting movie: {movie.movie_title}")
        
        # Delete the movie
        db.session.delete(movie)
        db.session.commit()
        
        print(f"Successfully deleted rating for movie ID: {movie_id}")
        
        return jsonify({'success': True, 'message': 'Rating deleted successfully'})
        
    except Exception as e:
        print(f"Error deleting rating: {str(e)}")
        db.session.rollback()  # Roll back in case of error
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/debug/full')
def full_debug():
    try:
        # Environment checks
        env_vars = {
            'OMDB_API_KEY': os.getenv('OMDB_API_KEY'),
            'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY'),
            'YOUTUBE_API_KEY': os.getenv('YOUTUBE_API_KEY'),
        }

        # Test OpenAI call
        openai_test_result = "Not tested"
        try:
            test_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            test_response = test_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": "Say hello"}],
                max_tokens=5
            )
            openai_test_result = test_response.choices[0].message.content
        except Exception as e:
            openai_test_result = f"Failed: {str(e)}"

        # Template existence
        index_exists = os.path.exists(os.path.join(app.template_folder, 'index.html')) if app.template_folder else False
        login_exists = os.path.exists(os.path.join(app.template_folder, 'login.html')) if app.template_folder else False

        # Database presence
        db_file_exists = os.path.exists(db_path)

        debug_info = {
            'Session': dict(session),
            'Authenticated': 'user_id' in session,
            'User ID': session.get('user_id'),
            'Username': session.get('username'),
            'Templates Folder': app.template_folder,
            'index.html Exists': index_exists,
            'login.html Exists': login_exists,
            'DB File Exists': db_file_exists,
            'Environment Variables': env_vars,
            'OpenAI Test Result': openai_test_result,
            'Current Directory': os.getcwd(),
            'Files in Current Dir': os.listdir(os.getcwd())
        }

        # Format nicely
        html = "<h1>Extended Flask Debug</h1><ul>"
        for key, value in debug_info.items():
            html += f"<li><strong>{key}:</strong> {value}</li>"
        html += "</ul><a href='/'>Go to homepage</a>"

        return html

    except Exception as e:
        return f"<h1>Error in full_debug</h1><p>{str(e)}</p>"


@app.route('/debug/users')
def debug_users():
    """List all users in the database (for debugging only)"""
    try:
        users = User.query.all()
        user_list = [{
            'id': u.id,
            'username': u.username,
            'created_at': u.created_at.isoformat() if u.created_at else None
        } for u in users]
        
        return jsonify({
            'user_count': len(user_list),
            'users': user_list
        })
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/debug/create-test-user')
def create_test_user():
    """Create a test user with a known password"""
    try:
        username = "driz"
        password = "drake"
        
        # Check if user already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return f"User '{username}' already exists with ID {existing_user.id}"
            
        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        
        return f"Created test user: username='{username}', password='{password}', id={new_user.id}"
    except Exception as e:
        db.session.rollback()
        return f"Error creating test user: {str(e)}"
    
@app.route('/debug/create-user/<username>/<password>')
def debug_create_user(username, password):
    """Create a user with specified username and password"""
    try:
        # Check if user exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return f"User '{username}' already exists with ID {existing_user.id}"
        
        # Create user
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        
        return f"User '{username}' created with ID {new_user.id}"
    except Exception as e:
        db.session.rollback()
        return f"Error creating user: {str(e)}"
    
@app.route('/api/auth/guest', methods=['POST'])
def guest_login():
    """Create a guest session with limited functionality"""
    try:
        # Create a temporary guest session
        session['is_guest'] = True
        session['username'] = 'Guest'
        
        return jsonify({
            'success': True,
            'message': 'Guest access granted'
        }), 200
    except Exception as e:
        print(f"Guest login error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500
    
@app.route('/api/movies/saved', methods=['GET'])
def get_saved_movies():
    try:
        # Get current user
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
            
        # Get both watchlist and rated movies
        watchlist_items = WatchlistItem.query.filter_by(user_id=user_id).all()
        rated_movies = MovieRating.query.filter_by(user_id=user_id).all()
        
        # Combine the data
        saved_movies = {
            'watchlist': [{
                'id': item.id,
                'title': item.movie_title,
                'poster': item.poster_url,
                'type': 'watchlist',
                'added_date': item.added_date.isoformat()
            } for item in watchlist_items],
            
            'ratings': [{
                'id': movie.id,
                'title': movie.movie_title,
                'poster': movie.poster_url,
                'type': 'rating',
                'rating': movie.rating,
                'review': movie.review,
                'added_date': movie.added_date.isoformat()
            } for movie in rated_movies]
        }
        
        return jsonify({
            'success': True,
            'movies': saved_movies
        })
        
    except Exception as e:
        print(f"Error fetching saved movies: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error fetching saved movies: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
