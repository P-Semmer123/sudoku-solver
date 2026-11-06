package com.sudokusolver.service;

import com.sudokusolver.entity.User;
import com.sudokusolver.repository.UserRepository;
import com.sudokusolver.exception.UsernameTakenException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    // TODO: Fix possible race condition when two users try to create an 
    // account using the same username. Doesn't currently break anything, but
    // leads to - for the user - not understandable error.
    public User register(String username, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new UsernameTakenException("Username already exists");
        }

        String passwordHash = passwordEncoder.encode(password);

        User user = new User(username, passwordHash);

        return userRepository.save(user);
    }
}
