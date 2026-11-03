package com.sudokusolver.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice 
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    // Needed by RegistrationService.java
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException exception) {
        
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(exception.getMessage());
    }
}