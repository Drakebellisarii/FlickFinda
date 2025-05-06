import requests
import random

Horror = ["The Babadook","Geralds Game", "Theres someone inside your house", "The platform", "Mr.Harrigans phone",
    "Berlin syndrom", "Texas chainsaw massicure", "Army of the dead", "the babysitter: killer queen", "Fear street part one", "A classic horror story",
    "1922", "the conjuring", "Death note", "In the tall grass", "Bird box", "The ritual", "Ouiji: Orgin of evil"]

Comedy = ["Superbad", "Anchorman", "The other guys", "Hustle", "We have a ghost", "Bad trip", "Between two ferns: the movie", "Set it up",
    "Dolemite is my name", "The Ballad of Buster scruggs", "Its whats inside", "Unfrosted", "Leo", "Do revenege", "Glass onion: a knifes out mystery", "I care a lot",
    "Red notice", "Spenser confidential", "The laundromat", "The Meyerowitz stories", "The breaker uppers", "Me time", "Old dads", "Its whats inside", "Dont look up",
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

genre = [Horror, Documentary, romCom, Comedy]

def select_genre():
    return random.choice(genre)

def select_movie(movies):
    return random.choice(movies)



def send_to_llm(prompt):
    url = "http://localhost:11434/api/generate"  # Replace with your LLM API endpoint
    headers = {"Content-Type": "application/json"}
    data = {
        "model": "llama2",
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(url, headers=headers, json=data)
    response_json = response.json()
    return response_json['response']

def main():
   """Main function to prompt user, select movie, and confirm."""

while True:
        print("Choose a genre or let it be random:")
        print("1. Horror")
        print("2. Comedy")
        print("3. Rom-Com")
        print("4. Documentary")
        print("5. Random")

        choice = input("Enter your choice (1-5) or 'q' to quit: ")
        if choice == 'q':
            break

        selected_movie = None
        if choice == '1':
            selected_movie = select_movie(Horror)
        elif choice == '2':
            selected_movie = select_movie(Comedy)
        elif choice == '3':
            selected_movie = select_movie(romCom)
        elif choice == '4':
            selected_movie = select_movie(Documentary)
        elif choice == '5':
            genre = select_genre()
            selected_movie = select_movie(genre) 
        else:
            print("Invalid choice. Please try again.")
            continue

        if selected_movie:
            print("Your movie selection is:", selected_movie)
            prompt = f"Write a short review only 4 sentences of the movie '{selected_movie}'"
            response = send_to_llm(prompt)
            print(response)

            confirmation = input("Are you okay with this selection? Type 'yes' or 'no': ")
            if confirmation.lower() == 'yes':
                print("Movie selection confirmed.")
                break  # Exit loop after confirmation


if __name__ == "__main__":
    main()