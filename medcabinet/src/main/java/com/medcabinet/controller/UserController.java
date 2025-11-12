package com.medcabinet.controller;

import com.medcabinet.dto.AuthResponse;
import com.medcabinet.model.User;
import com.medcabinet.security.JwtUtil;
import com.medcabinet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getId());
            return ResponseEntity.ok(new AuthResponse(token, savedUser.getId(), savedUser.getUsername()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{userId}/favorites/{medicineId}")
    public ResponseEntity<?> addFavoriteMedicine(@PathVariable Long userId, @PathVariable Long medicineId) {
        try {
            userService.addFavoriteMedicine(userId, medicineId);
            return ResponseEntity.ok().body(Map.of("message", "Medicine added to favorites"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/favorites/{medicineId}")
    public ResponseEntity<?> removeFavoriteMedicine(@PathVariable Long userId, @PathVariable Long medicineId) {
        try {
            userService.removeFavoriteMedicine(userId, medicineId);
            return ResponseEntity.ok().body(Map.of("message", "Medicine removed from favorites"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}