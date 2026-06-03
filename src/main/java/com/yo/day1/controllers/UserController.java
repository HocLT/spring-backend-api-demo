package com.yo.day1.controllers;

import com.yo.day1.common.ApiResponse;
import com.yo.day1.common.exception.BadRequestException;
import com.yo.day1.dto.auth.CurrentUserResponse;
import com.yo.day1.dto.user.UserCreationRequest;
import com.yo.day1.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CurrentUserResponse> createUser(@Valid @RequestBody UserCreationRequest request) throws BadRequestException {
        return ApiResponse.success("User created successfully. Email sent with login info.", userService.createUser(request));
    }
}
