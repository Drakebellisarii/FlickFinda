import tkinter as tk
from tkinter import ttk, messagebox
import hashlib
import json
from bs4 import BeautifulSoup
import os


Horror = ["The Babadook","Geralds Game", "Theres someone inside your house", "The platform", "Mr.Harrigans phone",
    "Berlin syndrom", "Texas chainsaw massicure", "Army of the dead", "the babysitter: killer queen", "Fear street part one", "A classic horror story",
    "1922", "the conjuring", "Death note", "In the tall grass", "Bird box", "The ritual", "Ouiji: Orgin of evil"] 

Comedy = ["Superbad", "Anchorman", "The other guys", "Hustle", "We have a ghost", "Bad trip", "Between two ferns: the movie", "Set it up",
    "Dolemite is my name", "The Ballad of Buster scruggs", "Its whats inside", "Unfrosted", "Leo", "Do revenege", "Glass onion: a knifes out mystery", "I care a lot",
    "Red notice", "Spenser confidential", "The laundromat", "The Meyerowitz stories", "The breaker uppers", "Me time", "Old dads", "Dont look up",
    "Dumb money", "Hustle", "The package"]

romCom = ["Always be my maybe", "Somethings gotta give", "set it up", "No hard feelings", "Persuasion", "Look both ways", "Love and leashes", "The half of it",
            "Someone great", "The love birds", "plus one", "He's all that", "Desperados", "Nappily Ever After", "Good on paper", "My best friends wedding", "The incredible jessica james",
            "Sierra Burgess is a loser", "Anyone but you", "players", "The perfect find", "A tourests guide to love", "Set it up", "Alex Strangelove", "Love hard", "Love in the villa",
            "To all the boys I've loved before"]

Documentary = ["Our Planet", "13th", "The Social Dilemma", "Making a Murderer", "My Octopus Teacher", "Wild Wild Country","Tiger King","Inside Bill's Brain: Decoding Bill Gates",
            "Crip Camp", "American Factory", "Seaspiracy", "Night on Earth", "Fyre: The Greatest Party That Never Happened", "David Attenborough: A Life on Our Planet", "The Tinder Swindler",
            "Conversations with a Killer: The Ted Bundy Tapes", "The Great Hack", "Abducted in Plain Sight", "The Pharmacist", "Icarus", "Knock Down the House", "Homecoming: A Film by Beyoncé", "The Innocent Man",
            "Don't F**k with Cats: Hunting an Internet Killer", "Cocaine Cowboys: The Kings of Miami", "Chef's Table", "Rotten", "Explained", "Break Point", "Untold: The Girlfriend Who Didn't Exist", "Down to Earth with Zac Efron",
            "Fantastic Fungi", "Chasing Coral"]

Christmas = ["Home Alone", "Home Alone 2: Lost in New York", "Elf", "A Christmas Story", "It's a Wonderful Life", "National Lampoon's Christmas Vacation","The Polar Express","How the Grinch Stole Christmas (2000)", "Dr. Seuss' The Grinch (2018)", 
             "Miracle on 34th Street (1994)", "The Santa Clause","Love Actually","The Holiday","Arthur Christmas","Klaus","Scrooged","A Charlie Brown Christmas","Rudolph the Red-Nosed Reindeer","Frosty the Snowman","White Christmas",
             "Jingle All the Way","The Nightmare Before Christmas","Bad Santa","Noelle"]


genre = [Horror, Documentary, romCom, Comedy, Christmas]


class LoginGUI:
     def __init__(self, root):
        # Initialize the main window
        self.root = root
        self.root.title("Login System")
        self.root.geometry("400x300")
        self.root.resizable(False, False)
        
        # Configure styles for a modern look
        self.style = ttk.Style()
        self.style.configure('TLabel', padding=5, font=('Arial', 10))
        self.style.configure('TButton', padding=5, font=('Arial', 10))
        self.style.configure('TEntry', padding=5)
        
        # Initialize the credentials system
        # This JSON file acts as our simple database
        self.credentials_file = "credentials.json"
        self.load_credentials()
        
        # Create and show the login frame
        self.create_login_frame()
        
        # Track login status
        self.login_successful = False
        
     def load_credentials(self):
        """Load existing credentials from file or create new ones if file doesn't exist."""
        try:
            # Try to read existing credentials
            with open(self.credentials_file, 'r') as f:
                self.credentials = json.load(f)
                # If the file exists but doesn't have the users key, add it
                if "users" not in self.credentials:
                    self.credentials["users"] = {}
                    self.save_credentials()
        except (FileNotFoundError, json.JSONDecodeError):
            # If file doesn't exist or is invalid, create new credentials structure
            self.credentials = {"users": {}}
            self.save_credentials()

     def save_credentials(self):
        with open(self.credentials_file, 'w', encoding='utf-8') as f:
            json.dump(self.credentials, f, indent=4)
    
     def hash_password(self, password):
        """Create a secure hash of the password using SHA-256."""
        return hashlib.sha256(password.encode()).hexdigest()
    
     def create_login_frame(self):
        """Create the main login frame."""
        # Clear any existing widgets
        for widget in self.root.winfo_children():
            widget.destroy()
        
        # Create main frame
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title
        title_label = ttk.Label(main_frame, text="Login System", font=('Arial', 16, 'bold'))
        title_label.grid(row=0, column=0, columnspan=2, pady=20)
        
        # Username
        ttk.Label(main_frame, text="Username:").grid(row=1, column=0, sticky=tk.W)
        self.username_var = tk.StringVar()
        username_entry = ttk.Entry(main_frame, textvariable=self.username_var)
        username_entry.grid(row=1, column=1, padx=5, pady=5, sticky=(tk.W, tk.E))
        
        # Password
        ttk.Label(main_frame, text="Password:").grid(row=2, column=0, sticky=tk.W)
        self.password_var = tk.StringVar()
        password_entry = ttk.Entry(main_frame, textvariable=self.password_var, show="*")
        password_entry.grid(row=2, column=1, padx=5, pady=5, sticky=(tk.W, tk.E))
        
        # Login button
        login_btn = ttk.Button(main_frame, text="Login", command=self.login)
        login_btn.grid(row=3, column=0, columnspan=2, pady=20)
        
        # Register link
        register_link = ttk.Button(main_frame, text="Register New Account", command=self.create_register_frame)
        register_link.grid(row=4, column=0, columnspan=2)
        
        # Configure grid weights
        main_frame.columnconfigure(1, weight=1)
    
     def create_register_frame(self):
        """Create the registration frame."""
        # Clear existing widgets
        for widget in self.root.winfo_children():
            widget.destroy()
        
        # Create main frame
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title
        title_label = ttk.Label(main_frame, text="Register New Account", font=('Arial', 16, 'bold'))
        title_label.grid(row=0, column=0, columnspan=2, pady=20)
        
        # Username
        ttk.Label(main_frame, text="Username:").grid(row=1, column=0, sticky=tk.W)
        self.reg_username_var = tk.StringVar()
        username_entry = ttk.Entry(main_frame, textvariable=self.reg_username_var)
        username_entry.grid(row=1, column=1, padx=5, pady=5, sticky=(tk.W, tk.E))
        
        # Password
        ttk.Label(main_frame, text="Password:").grid(row=2, column=0, sticky=tk.W)
        self.reg_password_var = tk.StringVar()
        password_entry = ttk.Entry(main_frame, textvariable=self.reg_password_var, show="*")
        password_entry.grid(row=2, column=1, padx=5, pady=5, sticky=(tk.W, tk.E))
        
        # Confirm Password
        ttk.Label(main_frame, text="Confirm Password:").grid(row=3, column=0, sticky=tk.W)
        self.reg_confirm_var = tk.StringVar()
        confirm_entry = ttk.Entry(main_frame, textvariable=self.reg_confirm_var, show="*")
        confirm_entry.grid(row=3, column=1, padx=5, pady=5, sticky=(tk.W, tk.E))
        
        # Register button
        register_btn = ttk.Button(main_frame, text="Register", command=self.register)
        register_btn.grid(row=4, column=0, columnspan=2, pady=20)
        
        # Back to login link
        back_link = ttk.Button(main_frame, text="Back to Login", command=self.create_login_frame)
        back_link.grid(row=5, column=0, columnspan=2)
        
        # Configure grid weights
        main_frame.columnconfigure(1, weight=1)
    
     def login(self):
        """Handle login process."""
        username = self.username_var.get().strip()
        password = self.password_var.get()
    
        # Ensure we have the users dictionary
        if "users" not in self.credentials:
            self.credentials["users"] = {}
            self.save_credentials()
    
        if username in self.credentials["users"] and self.credentials["users"][username] == self.hash_password(password):
            messagebox.showinfo("Success", "Login successful!")
            self.login_successful = True
            self.root.quit()  # Close the window after successful login
        else:
            messagebox.showerror("Error", "Invalid username or password")
    
     def register(self):
        """Handle registration process."""
        username = self.reg_username_var.get().strip()
        password = self.reg_password_var.get()
        confirm = self.reg_confirm_var.get()
    
        # Ensure we have the users dictionary
        if "users" not in self.credentials:
            self.credentials["users"] = {}
    
        if not username or not password:
            messagebox.showerror("Error", "Please fill in all fields")
            return
    
        if username in self.credentials["users"]:
            messagebox.showerror("Error", "Username already exists")
            return
    
        if password != confirm:
            messagebox.showerror("Error", "Passwords don't match")
            return
    
        # Store the new user
        self.credentials["users"][username] = self.hash_password(password)
        self.save_credentials()
        messagebox.showinfo("Success", "Registration successful!")
        self.create_login_frame()

def authenticate():
    """Run the login GUI and return whether authentication was successful."""
    root = tk.Tk()
    app = LoginGUI(root)
    root.mainloop()
    return app.login_successful
