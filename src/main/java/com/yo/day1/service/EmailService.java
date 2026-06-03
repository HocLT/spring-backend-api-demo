package com.yo.day1.service;

public interface EmailService {
    void sendAccountCreationEmail(String toEmail, String fullName, String username, String password);
}
