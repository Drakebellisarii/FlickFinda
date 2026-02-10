# FlickFinda

FlickFinda is a web application designed to make movie selection effortless. It helps users discover new movies, create watchlists, track watched movies, and access trailers - all in one convenient platform.

## Features

- **AI-Powered Movie Recommendations**: Get personalized movie suggestions based on your mood, preferences, or descriptions
- **Movie Information**: View detailed information about movies including plot summaries, awards, and ratings
- **Watchlist Management**: Create and manage your personal watchlist
- **Watched List**: Track movies you've already seen with ratings and reviews
- **Trailer Integration**: Watch movie trailers directly within the application
- **Multi-Movie Search**: Search for multiple movies at once and compare them
- **User Authentication**: Secure user accounts to store your personal movie preferences
- **Modern React UI**: Sleek, responsive interface with smooth animations

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: React with TypeScript, Tailwind CSS, Framer Motion
- **Database**: SQLite with SQLAlchemy
- **APIs**: 
  - YouTube API for movie trailers
  - OMDB API for movie information
  - OpenAI API for AI-powered recommendations

## Installation

### Prerequisites
- Python 3.7 or higher
- Node.js 16 or higher
- npm or yarn package manager
- pip (Python package manager)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Drakebellisarii/FlickFinda.git
   cd FlickFinda
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Install Node.js dependencies and build the frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

5. Set up environment variables:
   Create a `.env` file in the project root with the following variables:
   ```
   OMDB_API_KEY=your_omdb_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

6. Initialize the database:
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

7. Run the application:
   ```bash
   cd src/movie_app
   python app.py
   # or
   flask run
   ```

8. Open your browser and go to:
   ```
   http://localhost:5000
   ```

## Development

### Frontend Development

To run the frontend in development mode with hot-reload:

```bash
cd frontend
npm run dev
```

This will start the Vite dev server on `http://localhost:5173` with API proxying to the Flask backend.

### Building for Production

To build the frontend for production:

```bash
cd frontend
npm run build
```

This will compile the React app and output to `src/movie_app/static/dist/`.

## Usage

### Movie Discovery
- Enter a description of what kind of movie you're in the mood for
- Choose how many movie suggestions you want to see (1-6)
- Filter by streaming service (Netflix, Hulu, Disney+, Prime Video, HBO Max)
- Review the AI-generated suggestions with detailed information

### Managing Your Movies
- Add movies to your watchlist for later viewing
- Mark movies as watched after you've seen them
- Rate and review the movies you've watched (1-10 stars)
- Edit or delete your ratings and reviews

### Watching Trailers
- Click "Watch Trailer" to view trailers within the application
- Use the built-in video player controls

## Project Structure

```
FlickFinda/
├── src/
│   └── movie_app/
│       ├── app.py                # Main Flask application
│       ├── templates/            # Jinja2 templates (login page)
│       └── static/
│           └── dist/             # React build output
├── frontend/                     # React frontend source
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Page components
│   │   ├── api/                  # API service layer
│   │   ├── types/                # TypeScript types
│   │   └── hooks/                # Custom React hooks
│   ├── package.json
│   └── vite.config.ts
├── .env                          # Environment variables (not tracked by git)
├── requirements.txt              # Python dependencies
└── README.md                     # Project documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgements

- [OMDB API](https://www.omdbapi.com/) for movie information
- [YouTube API](https://developers.google.com/youtube/v3) for trailer videos
- [OpenAI](https://openai.com/) for AI-powered recommendations
- All the movie lovers who inspired this project!
