package com.sudokusolver.controller;

import com.sudokusolver.dto.RegisterRequest;
import com.sudokusolver.service.RegistrationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController 
@RequestMapping("/api/auth")
public class RegistrationController {
    
    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/register")
    // @Valid enforces the rules defined in RegisterRequest.java
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest request) {
        registrationService.register(
            request.username(),
            request.password()
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .build();
    }
}
