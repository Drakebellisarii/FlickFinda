import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class MovieGUI {

    static String[] Horror = {"The Babadook", "Geralds Game", "Theres someone inside your house", "The platform", "Mr.Harrigans phone",
            "Berlin syndrom", "Texas chainsaw massacre", "Army of the dead", "the babysitter: killer queen", "Fear street part one", "A classic horror story",
            "1922", "the conjuring", "Death note", "In the tall grass", "Bird box", "The ritual", "Ouija: Origin of evil"};
    static String[] Comedy = {"Superbad", "Anchorman", "The other guys", "Hustle", "We have a ghost", "Bad trip", "Between two ferns: the movie", "Set it up",
            "Dolemite is my name", "The Ballad of Buster scruggs", "Its whats inside", "Unfrosted", "Leo", "Do revenge", "Glass onion: a knives out mystery", "I care a lot",
            "Red notice", "Spenser confidential", "The laundromat", "The Meyerowitz stories", "The breaker uppers", "Me time", "Old dads", "Its whats inside", "Dont look up",
            "Dumb money", "Hustle", "The package"};
    static String[] romCom = {"Always be my maybe", "Somethings gotta give", "set it up", "No hard feelings", "Persuasion", "Look both ways", "Love and leashes", "The half of it",
            "Someone great", "The love birds", "plus one", "He's all that", "Desperados", "Nappily Ever After", "Good on paper", "My best friends wedding", "The incredible jessica james",
            "Sierra Burgess is a loser", "Anyone but you", "players", "The perfect find", "A tourists guide to love", "Set it up", "Alex Strangelove", "Love hard", "Love in the villa",
            "To all the boys I've loved before"};
    static String[] Documentary = {"Our Planet", "13th", "The Social Dilemma", "Making a Murderer", "My Octopus Teacher", "Wild Wild Country", "Tiger King", "Inside Bill's Brain: Decoding Bill Gates",
            "Crip Camp", "American Factory", "Seaspiracy", "Night on Earth", "Fyre: The Greatest Party That Never Happened", "David Attenborough: A Life on Our Planet", "The Tinder Swindler",
            "Conversations with a Killer: The Ted Bundy Tapes", "The Great Hack", "Abducted in Plain Sight", "The Pharmacist", "Icarus", "Knock Down the House", "Homecoming: A Film by Beyoncé", "The Innocent Man",
            "Don't F**k with Cats: Hunting an Internet Killer", "Cocaine Cowboys: The Kings of Miami", "Chef's Table", "Rotten", "Explained", "Break Point", "Untold: The Girlfriend Who Didn't Exist", "Down to Earth with Zac Efron",
            "Fantastic Fungi", "Chasing Coral"};

    static String[][] genre = {Horror, Comedy, romCom, Documentary};

    public static String[] selectGenre() {
        return genre[(int) (Math.random() * 4)];
    }

    public static String selection(String[] gen) {
        return gen[(int) (Math.random() * gen.length)];
    }

    public static void main(String[] args) {
        // Create the main frame
        JFrame frame = new JFrame("Movie Selector");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(400, 300);

        // Create a panel for buttons
        JPanel panel = new JPanel();
        panel.setLayout(new GridLayout(6, 1));

        // Create a label to display the selected movie
        JLabel movieLabel = new JLabel("", SwingConstants.CENTER);
        movieLabel.setFont(new Font("Arial", Font.BOLD, 14));

        // Buttons for genres
        JButton horrorButton = new JButton("Horror");
        JButton comedyButton = new JButton("Comedy");
        JButton romComButton = new JButton("Rom-Com");
        JButton documentaryButton = new JButton("Documentary");
        JButton randomButton = new JButton("Random");
        JButton confirmButton = new JButton("Is this movie okay?");

        // Add action listeners to buttons
        horrorButton.addActionListener(e -> movieLabel.setText("Your movie: " + selection(Horror)));
        comedyButton.addActionListener(e -> movieLabel.setText("Your movie: " + selection(Comedy)));
        romComButton.addActionListener(e -> movieLabel.setText("Your movie: " + selection(romCom)));
        documentaryButton.addActionListener(e -> movieLabel.setText("Your movie: " + selection(Documentary)));
        randomButton.addActionListener(e -> movieLabel.setText("Your movie: " + selection(selectGenre())));

        confirmButton.addActionListener(e -> {
            String currentText = movieLabel.getText();
            if (currentText.isEmpty()) {
                JOptionPane.showMessageDialog(frame, "Please select a movie first.", "No Movie Selected", JOptionPane.WARNING_MESSAGE);
            } else {
                int response = JOptionPane.showConfirmDialog(frame, "Do you like this movie?", "Confirm Movie", JOptionPane.YES_NO_OPTION);
                if (response == JOptionPane.NO_OPTION) {
                    movieLabel.setText("Your movie: " + selection(selectGenre()));
                }
            }
        });

        // Add buttons to the panel
        panel.add(horrorButton);
        panel.add(comedyButton);
        panel.add(romComButton);
        panel.add(documentaryButton);
        panel.add(randomButton);
        panel.add(confirmButton);

        // Add panel and label to the frame
        frame.setLayout(new BorderLayout());
        frame.add(panel, BorderLayout.CENTER);
        frame.add(movieLabel, BorderLayout.SOUTH);

        // Make the frame visible
        frame.setVisible(true);
    }
}
