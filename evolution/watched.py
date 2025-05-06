from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///watched_movies.db'  # Change DB as needed
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class WatchedMovie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_title = db.Column(db.String(200), nullable=False, unique=True)
    poster_url = db.Column(db.String(500))
    rating = db.Column(db.Float, nullable=False)  # User rating (1-10)
    review = db.Column(db.Text)  # User's personal review
    watched_date = db.Column(db.DateTime, default=datetime.now(timezone.utc))

@app.route('/api/watched/add', methods=['POST'])
def add_watched_movie():
    try:
        data = request.get_json()
        movie_title = data.get('title')
        poster_url = data.get('poster')
        rating = data.get('rating')
        review = data.get('review')

        if not movie_title or rating is None:
            return jsonify({'message': 'Title and rating are required', 'success': False}), 400
        
        existing_movie = WatchedMovie.query.filter_by(movie_title=movie_title).first()
        if existing_movie:
            return jsonify({'message': 'Movie already in watched list', 'success': False}), 400

        new_movie = WatchedMovie(
            movie_title=movie_title,
            poster_url=poster_url,
            rating=rating,
            review=review
        )
        db.session.add(new_movie)
        db.session.commit()

        return jsonify({'message': 'Movie added to watched list', 'success': True}), 200
    except Exception as e:
        print(f"Error adding watched movie: {str(e)}")
        return jsonify({'message': 'Error adding movie', 'success': False}), 500

@app.route('/api/watched/remove', methods=['POST'])
def remove_watched_movie():
    try:
        data = request.get_json()
        movie_title = data.get('title')

        movie = WatchedMovie.query.filter_by(movie_title=movie_title).first()
        if movie:
            db.session.delete(movie)
            db.session.commit()
            return jsonify({'message': 'Movie removed from watched list', 'success': True}), 200

        return jsonify({'message': 'Movie not found in watched list', 'success': False}), 404
    except Exception as e:
        print(f"Error removing watched movie: {str(e)}")
        return jsonify({'message': 'Error removing movie', 'success': False}), 500

@app.route('/api/watched', methods=['GET'])
def get_watched_movies():
    try:
        movies = WatchedMovie.query.order_by(WatchedMovie.watched_date.desc()).all()
        watched_list = [{
            'title': movie.movie_title,
            'poster': movie.poster_url,
            'rating': movie.rating,
            'review': movie.review,
            'watched_date': movie.watched_date.isoformat()
        } for movie in movies]
        return jsonify({'watched_movies': watched_list, 'success': True})
    except Exception as e:
        print(f"Error fetching watched movies: {str(e)}")
        return jsonify({'message': 'Error fetching movies', 'success': False}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure the database and tables are created
    app.run(debug=True)
