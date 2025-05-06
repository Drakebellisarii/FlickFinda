import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.channels.Channel;
import java.sql.Connection;
import java.util.Scanner;

public class Movie {
    static String[] Horror = {"The Babadook","Geralds Game", "Theres someone inside your house", "The platform", "Mr.Harrigans phone",
    "Berlin syndrom", "Texas chainsaw massicure", "Army of the dead", "the babysitter: killer queen", "Fear street part one", "A classic horror story",
    "1922", "the conjuring", "Death note", "In the tall grass", "Bird box", "The ritual", "Ouiji: Orgin of evil"};
    static String[] Comedy = {"Superbad", "Anchorman", "The other guys", "Hustle", "We have a ghost", "Bad trip", "Between two ferns: the movie", "Set it up",
    "Dolemite is my name", "The Ballad of Buster scruggs", "Its whats inside", "Unfrosted", "Leo", "Do revenege", "Glass onion: a knifes out mystery", "I care a lot",
    "Red notice", "Spenser confidential", "The laundromat", "The Meyerowitz stories", "The breaker uppers", "Me time", "Old dads", "Its whats inside", "Dont look up",
    "Dumb money", "Hustle", "The package"};
    static String[] romCom = {"Always be my maybe", "Somethings gotta give", "set it up", "No hard feelings", "Persuasion", "Look both ways", "Love and leashes", "The half of it",
            "Someone great", "The love birds", "plus one", "He's all that", "Desperados", "Nappily Ever After", "Good on paper", "My best friends wedding", "The incredible jessica james",
            "Sierra Burgess is a loser", "Anyone but you", "players", "The perfect find", "A tourests guide to love", "Set it up", "Alex Strangelove", "Love hard", "Love in the villa",
            "To all the boys I've loved before"};
    static String[] Documentary = {"Our Planet", "13th", "The Social Dilemma", "Making a Murderer", "My Octopus Teacher", "Wild Wild Country","Tiger King","Inside Bill's Brain: Decoding Bill Gates",
            "Crip Camp", "American Factory", "Seaspiracy", "Night on Earth", "Fyre: The Greatest Party That Never Happened", "David Attenborough: A Life on Our Planet", "The Tinder Swindler",
            "Conversations with a Killer: The Ted Bundy Tapes", "The Great Hack", "Abducted in Plain Sight", "The Pharmacist", "Icarus", "Knock Down the House", "Homecoming: A Film by Beyoncé", "The Innocent Man",
            "Don't F**k with Cats: Hunting an Internet Killer", "Cocaine Cowboys: The Kings of Miami", "Chef's Table", "Rotten", "Explained", "Break Point", "Untold: The Girlfriend Who Didn't Exist", "Down to Earth with Zac Efron",
            "Fantastic Fungi", "Chasing Coral" };

    static String[][]genre = { Horror , Comedy, romCom, Documentary};;

    public Movie()
    {

    }

    public static String[] selectGenre()
    {
        return genre[(int) (Math.random()*4)];
    }

    public static String selection(String[]gen)
    {
        String selectedMovie =  gen[(int) (Math.random()*gen.length)];
       return selectedMovie;
    }


    public static void main(String[] args) throws IOException
     {
        Movie movie = new Movie();
        Scanner scanner = new Scanner(System.in);
        int status = 0;

        while(status == 0) {
            System.out.println("Choose a genre or let it be random:");
            System.out.println("1. Horror");
            System.out.println("2. Comedy");
            System.out.println("3. Rom-Com");
            System.out.println("4. Documentary");
            System.out.println("5. Random");

            System.out.print("Enter your choice (1-5): ");
            int choice = scanner.nextInt();
            String selectedMovie = null;
            if (choice == 1) {
                selectedMovie = selection(Horror);
            } else if (choice == 2) {
                selectedMovie = selection(Comedy);
            } else if (choice == 3) {
                selectedMovie = selection(romCom);
            } else if (choice == 4) {
                selectedMovie = selection(Documentary);
            } else if (choice == 5) {
                selectedMovie = selection(selectGenre());
            }
            System.out.println("Your movie selection is: " + selectedMovie);
            System.out.println("Are you okay with this selection? Type yes or no: ");
            if(scanner.next().equals("yes"))
            {
                status = 1;
            }
        }
        scanner.close();
    }

}
