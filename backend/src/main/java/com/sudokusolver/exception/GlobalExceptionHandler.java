package com.sudokusolver.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.CannotCreateTransactionException;

@RestControllerAdvice 
public class GlobalExceptionHandler {

    // For when database is offline... as the error message reads :'D
    @ExceptionHandler(CannotCreateTransactionException.class)
    public ResponseEntity<String> handleDatabaseUnavailable(
        CannotCreateTransactionException exception
    ) {
        return ResponseEntity
            .status(HttpStatus.SERVICE_UNAVAILABLE)
            .body("Database currently unavailable.");
    }

    @ExceptionHandler(UsernameTakenException.class)
    public ResponseEntity<String> handleUsernameTaken(UsernameTakenException exception) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(exception.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException exception) {
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(exception.getMessage());
    }
}