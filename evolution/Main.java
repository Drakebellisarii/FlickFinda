import java.net.InetAddress;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class Main {
    public static void main(String[] args) {
            Movie instance1 = new Movie();
            Movie instance2 = new Movie();
            Movie instance3 = new Movie();


            System.out.println(instance1.selection(instance1.selectGenre()));
            System.out.println(instance2.selection(instance2.selectGenre()));
            System.out.println(instance3.selection(instance3.selectGenre()));

             try {
            InetAddress ip = InetAddress.getLocalHost();
            System.out.println("IP Address: " + ip.getHostAddress());
        } catch (UnknownHostException ex) {
            System.out.println("Hostname can not be resolved");
        }
    }
}