package com.sudokusolver.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Capital L, because this is the wrapper class

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String password_hash;

    @Column(nullable = false, length = 20)
    private String role = "user";

    // no-argument constructor required by Hibernate for instantiating
    // entities when retrieving them from the database.
    protected User(){
        return;
    }

    // Expects a hashed password, of course.
    public User(String username, String password_hash) {
        this.username = username;
        this.password_hash = password_hash;
        this.role = "user";
    }

    // TODO: Reevaluate access modifiers for all get and set functions here.

    public Long getId() {
        return id;
    }

    void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    void setPasswordHash(String password_hash) {
        this.password_hash = password_hash;
    }

    String getPasswordHash() {
        return password_hash;
    }

    public String getRole() {
        return role;
    }
}
