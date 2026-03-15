import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class test_bcrypt {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "password";
        String encodedPassword = encoder.encode(rawPassword);
        System.out.println("Encoded: " + encodedPassword);
        
        String dbHash = "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGF4pPqN.Z8K4/rFXx6G";
        boolean matches = encoder.matches(rawPassword, dbHash);
        System.out.println("Matches: " + matches);
    }
}
