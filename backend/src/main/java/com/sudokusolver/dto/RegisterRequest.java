package com.sudokusolver.dto; // dto = Data Transfer Object

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest (
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters long")
    String username,

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters long")
    @Pattern(
        regexp = "^[\\x20-\\x7E]+$",
        message = "Password must contain only ASCII characters"
    )
    String password
) {}
