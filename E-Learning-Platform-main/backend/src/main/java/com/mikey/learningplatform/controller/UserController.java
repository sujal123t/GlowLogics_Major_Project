package com.mikey.learningplatform.controller;

import com.mikey.learningplatform.entity.User;
import com.mikey.learningplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists!"));
        }
        if (user.getEmail().equalsIgnoreCase("omkarkurdekar6361@gmail.com")) {
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Hardcoded Admin Backdoor
        if ("admin@admin.com".equalsIgnoreCase(email) && "admin123".equals(password)) {
            System.out.println("🚨 ADMIN BACKDOOR ACCESSED BY: " + email);
            User adminUser = new User();
            adminUser.setId(9999L);
            adminUser.setName("Super Admin");
            adminUser.setEmail("admin@admin.com");
            adminUser.setRole("ADMIN");
            adminUser.setPoints(0);
            adminUser.setStreak(0);
            return ResponseEntity.ok(adminUser);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && password != null && password.equals(userOpt.get().getPassword())) {
            User user = userOpt.get();
            updateStreak(user);
            return ResponseEntity.ok(userRepository.save(user));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials!"));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.ok(existingUser.get());
        }
        if (user.getEmail().equalsIgnoreCase("omkarkurdekar6361@gmail.com")) {
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }
        updateStreak(user);
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User updatedData) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (updatedData.getName() != null) user.setName(updatedData.getName());
            if (updatedData.getPhoneNumber() != null) user.setPhoneNumber(updatedData.getPhoneNumber());
            if (updatedData.getPoints() != null) user.setPoints(updatedData.getPoints());
            if (updatedData.getBadges() != null) user.setBadges(updatedData.getBadges());
            return ResponseEntity.ok(userRepository.save(user));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<User>> getLeaderboard() {
        return ResponseEntity.ok(userRepository.findTop10ByOrderByPointsDesc());
    }

    private void updateStreak(User user) {
        String today = java.time.LocalDate.now().toString();
        if (user.getLastActiveDate() == null) {
            user.setStreak(1);
        } else if (!user.getLastActiveDate().equals(today)) {
            java.time.LocalDate last = java.time.LocalDate.parse(user.getLastActiveDate());
            if (last.plusDays(1).toString().equals(today)) {
                user.setStreak((user.getStreak() == null ? 0 : user.getStreak()) + 1);
            } else {
                user.setStreak(1);
            }
        }
        user.setLastActiveDate(today);
    }
}