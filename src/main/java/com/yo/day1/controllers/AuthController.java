package com.yo.day1.controllers;

import com.yo.day1.common.ApiResponse;
import com.yo.day1.common.exception.BadRequestException;
import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.dto.auth.*;
import com.yo.day1.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping(value = "/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and current-user endpoints.")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticates a user and returns access and refresh tokens.", security = {})
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login successful", authService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Exchanges a valid refresh token for a new access token pair.", security = {})
    public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.success("Token refreshed", authService.refresh(request));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password", description = "Changes the password for the currently authenticated user.")
    @SecurityRequirement(name = "bearerAuth")
    public ApiResponse<Void> changePassword(Principal principal,
                @Valid @RequestBody ChangePasswordRequest request) throws BadRequestException, NotFoundException {
        authService.changePassword(principal.getName(), request);
        return ApiResponse.successMessage("Password changed successfully");
    }

    @GetMapping("/me")
    @Operation(summary = "Current user", description = "Returns the authenticated user's profile.")
    @SecurityRequirement(name = "bearerAuth")
    public ApiResponse<CurrentUserResponse> me(Principal principal) throws BadRequestException, NotFoundException {
        return ApiResponse.success(authService.me(principal.getName()));
    }
}
