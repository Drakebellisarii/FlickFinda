# main.py
from LoginGUI import authenticate
from movie_data import MovieDataService
from rating_service import RatingService
from review_service import ReviewService
from ui_service import MovieApp
#from movie_selector_kivy import MovieSelectorApp

def main():
    if authenticate():
        movie_data_service = MovieDataService()
        rating_service = RatingService()
        review_service = ReviewService()

        
        #use for simpler ui
        app = MovieApp(movie_data_service, rating_service, review_service)
        app.mainloop()
    else:
        print("Login failed or window was closed.")

if __name__ == "__main__":
    main()