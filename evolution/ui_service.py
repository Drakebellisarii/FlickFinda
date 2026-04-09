import tkinter as tk
from tkinter import ttk, messagebox
import math
import random

class MovieApp(tk.Tk):
    def __init__(self, movie_data_service, rating_service, review_service):
        super().__init__()
        self.title("Movie Selector")
        self.geometry("1000x900")
        
        # Configure the window
        self.configure(bg='#f0f0f0')
        
        # Configure styles
        self.style = ttk.Style()
        self.style.configure('Title.TLabel', font=('Helvetica', 24, 'bold'), padding=10)
        self.style.configure('Header.TLabel', font=('Helvetica', 12, 'bold'))
        self.style.configure('Custom.TLabelframe', padding=15)
        self.style.configure('Custom.TButton', padding=8)
        
        # Store services
        self.movie_data_service = movie_data_service
        self.rating_service = rating_service
        self.review_service = review_service
        
        # UI state variables
        self.genre_var = tk.StringVar(self)
        self.genre_var.set("Random")
        self.selected_movie_var = tk.StringVar(self)
        self.current_movie = None
        
        self.create_widgets()

    def create_widgets(self):
        # Main Container
        container = ttk.Frame(self, padding="20")
        container.pack(fill="both", expand=True)
        
        # App Title
        title_label = ttk.Label(container, text="Movie Selector", style='Title.TLabel')
        title_label.pack(pady=(0, 20))
        
        # Genre Selection
        genre_frame = ttk.LabelFrame(container, text="Select Your Movie", style='Custom.TLabelframe')
        genre_frame.pack(fill="x", pady=(0, 15))
        
        genre_grid = ttk.Frame(genre_frame)
        genre_grid.pack(pady=10)
        
        genre_label = ttk.Label(genre_grid, text="Genre:", style='Header.TLabel')
        genre_label.grid(row=0, column=0, padx=10, pady=5)
        
        genres = ["Random", "Horror", "romCom", "Documentary", "Comedy", "Christmas"]
        genre_dropdown = ttk.OptionMenu(genre_grid, self.genre_var, "Random", *genres)
        genre_dropdown.grid(row=0, column=1, padx=10, pady=5)
        
        select_button = ttk.Button(genre_grid, text="Find Movie", 
                                 command=self.select_movie, style='Custom.TButton')
        select_button.grid(row=0, column=2, padx=10, pady=5)
        
        # Movie Display and Trailer Section
        movie_frame = ttk.LabelFrame(container, text="Selected Movie", style='Custom.TLabelframe')
        movie_frame.pack(fill="x", pady=(0, 15))
        
        movie_label = ttk.Label(movie_frame, textvariable=self.selected_movie_var,
                               font=("Helvetica", 16, "bold"), foreground="#2c3e50")
        movie_label.pack(pady=10)
        
        # Ratings Section
        self.ratings_frame = ttk.LabelFrame(container, text="Ratings", style='Custom.TLabelframe')
        self.ratings_frame.pack(fill="x", pady=(0, 15))
        
        # Rating sources in a grid layout
        self.rating_labels = {}
        rating_sources = ["Rotten Tomatoes", "IMDb", "Metacritic"]
        
        for source in rating_sources:
            frame = ttk.Frame(self.ratings_frame)
            frame.pack(fill="x", pady=5)
            
            source_label = ttk.Label(frame, text=f"{source}:", style='Header.TLabel')
            source_label.pack(side="left", padx=(10, 0))
            
            rating_label = ttk.Label(frame, text="N/A", font=("Helvetica", 12))
            rating_label.pack(side="right", padx=(0, 10))
            self.rating_labels[source] = rating_label
        
        
        # Reviews Section
        reviews_frame = ttk.LabelFrame(container, text="Reviews & Analysis", style='Custom.TLabelframe')
        reviews_frame.pack(fill="both", expand=True, pady=(0, 15))
        
        # Action buttons
        button_frame = ttk.Frame(reviews_frame)
        button_frame.pack(fill="x", pady=(0, 10))
        
        fetch_button = ttk.Button(button_frame, text="Fetch Reviews & Ratings",
                                command=self.get_reviews_and_ratings, style='Custom.TButton')
        fetch_button.pack(side="left", padx=5)

        # Create Roulette Wheel Canvas
        self.canvas = tk.Canvas(container, width=400, height=400, bg="white")
        self.canvas.pack()
        
        # Review sections
        self.create_review_sections(reviews_frame)

    def create_review_sections(self, parent):
        # AI Review
       # self.llm_review_frame = ttk.LabelFrame(parent, text="AI Analysis", style='Custom.TLabelframe')
        #self.llm_review_frame.pack(fill="both", expand=True, pady=(0, 10))
        
       # self.llm_review = tk.Text(self.llm_review_frame, height=4, wrap=tk.WORD,
                                 #font=("Helvetica", 14), relief="flat", padx=10, pady=10)
       #self.llm_review.pack(fill="both", expand=True)
        
        # Web Reviews
        self.web_review_frame = ttk.LabelFrame(parent, text="Web Reviews", style='Custom.TLabelframe')
        self.web_review_frame.pack(fill="both", expand=True)
        
        self.web_review = tk.Text(self.web_review_frame, height=4, wrap=tk.WORD,
                                 font=("Helvetica", 14), relief="flat", padx=10, pady=10)
        self.web_review.pack(fill="both", expand=True)

    def select_movie(self):
        """Start roulette wheel animation"""
        self.clear_reviews()
        chosen_genre = self.genre_var.get()
        if chosen_genre == "Random":
            self.roulette_movies = [self.movie_data_service.get_random_movie() for _ in range(10)]
        else:
            self.roulette_movies = [self.movie_data_service.get_random_movie_from_genre(chosen_genre) for _ in range(10)]

        self.roulette_index = 0
        self.angle = 0
        self.rotation_speed = 20  # Initial speed
        self.animate_wheel()

    def animate_wheel(self):
        """Spin the roulette wheel and slow it down"""
        self.canvas.delete("all")  # Clear previous frame

        center_x, center_y = 150, 150
        radius = 100

        # Draw the outer roulette circle
        self.canvas.create_oval(center_x - radius, center_y - radius,
                            center_x + radius, center_y + radius,
                            outline="black", width=2, fill="lightgray")

        num_movies = len(self.roulette_movies)
        angle_step = 360 / num_movies

        for i in range(num_movies):
            angle = self.angle + (i * angle_step)
            radians = math.radians(angle)

            x = center_x + radius * math.cos(radians)
            y = center_y + radius * math.sin(radians)

            # Display movie names at calculated positions
            self.canvas.create_text(x, y, text=self.roulette_movies[i],
                                font=("Helvetica", 10, "bold"), fill="black")

        # Draw a selection indicator (triangle pointer)
        self.canvas.create_polygon(
        center_x - 8, center_y - radius + 10,
        center_x + 8, center_y - radius + 10,
        center_x, center_y - radius + 2,
        fill="red"
            )

        # Update the canvas
        self.update_idletasks()

        # Rotate & slow down
        if self.rotation_speed > 2:
            self.angle += self.rotation_speed
            self.rotation_speed *= 0.95  # Slow down effect
            self.after(100, self.animate_wheel)
        else:
            self.finalize_movie_selection()

    def finalize_movie_selection(self):
        """Pick final movie and display it"""
        final_movie = random.choice(self.roulette_movies)
        self.selected_movie_var.set(final_movie)
        

    def clear_reviews(self):
        """Clear all review displays"""
        #self.llm_review.delete("1.0", tk.END)
        self.web_review.delete("1.0", tk.END)
        for label in self.rating_labels.values():
            label.config(text="N/A")

    def get_reviews_and_ratings(self):
        movie = self.selected_movie_var.get()
        if not movie:
            messagebox.showwarning("Select a Movie", "Please select a movie first!")
            return
            
        
        try:
            # Fetch and display AI review
            #ai_review = self.review_service.get_ai_review(movie)
            #self.llm_review.insert("1.0", ai_review)
            
            # Fetch and display web reviews
            web_reviews = self.review_service.get_web_reviews(movie)
            self.web_review.insert("1.0", web_reviews)
            
        except Exception as e:
            self.web_review.insert("1.0", f"Error fetching data: {str(e)}")