package com.yo.day1.service.impl;

import com.yo.day1.common.exception.BadRequestException;
import com.yo.day1.domain.entity.Parent;
import com.yo.day1.domain.entity.Teacher;
import com.yo.day1.domain.entity.User;
import com.yo.day1.dto.auth.CurrentUserResponse;
import com.yo.day1.dto.user.UserCreationRequest;
import com.yo.day1.repository.ParentRepository;
import com.yo.day1.repository.TeacherRepository;
import com.yo.day1.repository.UserRepository;
import com.yo.day1.service.EmailService;
import com.yo.day1.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    @Transactional
    public CurrentUserResponse createUser(UserCreationRequest request) throws BadRequestException {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BadRequestException("Username is already taken");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setIsActive(true);

        if (request.getParentId() != null) {
            Parent parent = parentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new BadRequestException("Parent not found"));
            user.setParent(parent);
        }

        if (request.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new BadRequestException("Teacher not found"));
            user.setTeacher(teacher);
        }

        // Tự động sinh mật khẩu ngẫu nhiên 8 ký tự
        String generatedPassword = UUID.randomUUID().toString().substring(0, 8);
        user.setPasswordHash(passwordEncoder.encode(generatedPassword));

        User savedUser = userRepository.save(user);

        // Gửi email sau khi lưu thành công (nếu có email)
        if (savedUser.getEmail() != null && !savedUser.getEmail().isBlank()) {
            emailService.sendAccountCreationEmail(
                    savedUser.getEmail(),
                    savedUser.getFullName(),
                    savedUser.getUsername(),
                    generatedPassword
            );
        }

        return new CurrentUserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getFullName(),
                savedUser.getRole().name(),
                savedUser.getParent() != null ? savedUser.getParent().getId() : null,
                savedUser.getTeacher() != null ? savedUser.getTeacher().getId() : null
        );
    }
}
