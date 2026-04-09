import random

class MovieDataService:
    def __init__(self):
        self.Horror = ["The Babadook","Geralds Game", "Theres someone inside your house", "The platform", "Mr.Harrigans phone",
        "Berlin syndrom", "Texas chainsaw massicure", "Army of the dead", "the babysitter: killer queen", "Fear street part one", "A classic horror story",
        "1922", "the conjuring", "Death note", "In the tall grass", "Bird box", "The ritual",
        "Ouiji: Orgin of evil"]  # Copy full list
        
        self.Comedy = ["Superbad", "Anchorman", "The other guys", "Hustle", "We have a ghost", "Bad trip", "Between two ferns: the movie", "Set it up",
        "Dolemite is my name", "The Ballad of Buster scruggs", "Its whats inside", "Unfrosted", "Leo", "Do revenege", "Glass onion: a knifes out mystery", "I care a lot",
        "Red notice", "Spenser confidential", "The laundromat", "The Meyerowitz stories", "The breaker uppers", "Me time", "Old dads", "Dont look up",
        "Dumb money", "Hustle", "The package"]  # Copy full list
        
        self.romCom = ["Always be my maybe", "Somethings gotta give", "set it up", "No hard feelings", "Persuasion", "Look both ways", "Love and leashes", "The half of it",
            "Someone great", "The love birds", "plus one", "He's all that", "Desperados", "Nappily Ever After", "Good on paper", "My best friends wedding", "The incredible jessica james",
            "Sierra Burgess is a loser", "Anyone but you", "players", "The perfect find", "A tourests guide to love", "Set it up", "Alex Strangelove", "Love hard", "Love in the villa",
            "To all the boys I've loved before"]  
        
        self.Documentary = ["Our Planet", "13th", "The Social Dilemma", "Making a Murderer", "My Octopus Teacher", "Wild Wild Country","Tiger King","Inside Bill's Brain: Decoding Bill Gates",
            "Crip Camp", "American Factory", "Seaspiracy", "Night on Earth", "Fyre: The Greatest Party That Never Happened", "David Attenborough: A Life on Our Planet", "The Tinder Swindler",
            "Conversations with a Killer: The Ted Bundy Tapes", "The Great Hack", "Abducted in Plain Sight", "The Pharmacist", "Icarus", "Knock Down the House", "Homecoming: A Film by Beyoncé", "The Innocent Man",
            "Don't F**k with Cats: Hunting an Internet Killer", "Cocaine Cowboys: The Kings of Miami", "Chef's Table", "Rotten", "Explained", "Break Point", "Untold: The Girlfriend Who Didn't Exist", "Down to Earth with Zac Efron",
            "Fantastic Fungi", "Chasing Coral"]  # Copy full list
        
        self.Christmas = ["Home Alone", "Home Alone 2: Lost in New York", "Elf", "A Christmas Story", "It's a Wonderful Life", "National Lampoon's Christmas Vacation","The Polar Express","How the Grinch Stole Christmas (2000)", "Dr. Seuss' The Grinch (2018)", 
             "Miracle on 34th Street (1994)", "The Santa Clause","Love Actually","The Holiday","Arthur Christmas","Klaus","Scrooged","A Charlie Brown Christmas","Rudolph the Red-Nosed Reindeer","Frosty the Snowman","White Christmas",
             "Jingle All the Way","The Nightmare Before Christmas","Bad Santa","Noelle"]  # Copy full list
        
        self.genre_lists = {
            "Horror": self.Horror,
            "Comedy": self.Comedy,
            "romCom": self.romCom,
            "Documentary": self.Documentary,
            "Christmas": self.Christmas
        }
    
    def get_genre_lists(self):
        return self.genre_lists
    
    def get_random_movie(self):
        # Randomly choose a genre and return a random movie from that genre
        genre = random.choice(list(self.genre_lists.keys()))
        return random.choice(self.genre_lists[genre])
    
    def get_random_movie_from_genre(self, genre):
        # Return a random movie from a specified genre
        if genre in self.genre_lists:
            return random.choice(self.genre_lists[genre])
        else:
            raise ValueError(f"Genre '{genre}' not found in available genres")
        
