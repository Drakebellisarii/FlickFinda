# FlickFinda

FlickFinda is a web application designed to make movie selection effortless. It helps users discover new movies, create watchlists, track watched movies, and access trailers - all in one convenient platform.

## Features

- **AI-Powered Movie Recommendations**: Get personalized movie suggestions based on your mood, preferences, or descriptions
- **Movie Information**: View detailed information about movies including plot summaries, awards, and ratings
- **Watchlist Management**: Create and manage your personal watchlist
- **Watched List**: Track movies you've already seen
- **Trailer Integration**: Watch movie trailers directly within the application
- **Multi-Movie Search**: Search for multiple movies at once and compare them
- **User Authentication**: Secure user accounts to store your personal movie preferences

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite with SQLAlchemy
- **APIs**: 
  - YouTube API for movie trailers
  - OMDB API for movie information
  - OpenAI API for AI-powered recommendations

## Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/Drakebellisarii/FlickFinda.git
   cd FlickFinda
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install required packages:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the project root with the following variables:
   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   SECRET_KEY=your_secret_key
   YOUTUBE_API_KEY=your_youtube_api_key
   OMDB_API_KEY=your_omdb_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Initialize the database:
   ```
   flask db init
   flask db migrate
   flask db upgrade
   ```

6. Run the application:
   ```
   flask run
   ```

7. Open your browser and go to:
   ```
   http://localhost:5000
   ```

## Usage

### Movie Discovery
- Enter a description of what kind of movie you're in the mood for
- Choose how many movie suggestions you want to see
- Review the AI-generated suggestions

### Managing Your Movies
- Add movies to your watchlist for later viewing
- Mark movies as watched after you've seen them
- Rate and review the movies you've watched

### Watching Trailers
- Click "Watch Trailer" to view trailers within the application
- Use the built-in video player controls

## Project Structure

```
FlickFinda/
├── app.py               # Main application file
├── models.py            # Database models
├── routes.py            # API routes and view functions
├── static/              # Static assets (CSS, JS, images)
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   └── images/          # Image assets
├── templates/           # HTML templates
├── .env                 # Environment variables (not tracked by git)
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OMDB API](https://www.omdbapi.com/) for movie information
- [YouTube API](https://developers.google.com/youtube/v3) for trailer videos
- [OpenAI](https://openai.com/) for AI-powered recommendations
- All the movie lovers who inspired this project!
