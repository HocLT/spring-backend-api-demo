package com.yo.day1.service.impl;

import com.yo.day1.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username:noreply@yoedu.com}")
    private String fromEmail;

    @Async
    @Override
    public void sendAccountCreationEmail(String toEmail, String fullName, String username, String password) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("YOEDU - Thông tin tài khoản của bạn");
            
            String text = String.format("""
                    Xin chào %s,
                    
                    Tài khoản của bạn trên hệ thống YOEDU đã được tạo thành công.
                    Dưới đây là thông tin đăng nhập của bạn:
                    
                    - Tên đăng nhập: %s
                    - Mật khẩu tạm thời: %s
                    
                    Vui lòng đăng nhập và đổi mật khẩu trong lần truy cập đầu tiên để bảo mật tài khoản.
                    
                    Trân trọng,
                    Hệ thống quản lý YOEDU
                    """, fullName, username, password);
                    
            message.setText(text);
            javaMailSender.send(message);
            log.info("Account creation email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send account creation email to: {}", toEmail, e);
        }
    }
}
