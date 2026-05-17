package com.yo.day1.service;

import com.yo.day1.common.exception.BadRequestException;
import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.dto.auth.*;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(RefreshTokenRequest request);

    void changePassword(String username, ChangePasswordRequest request) throws BadRequestException, NotFoundException;

    CurrentUserResponse me(String username) throws BadRequestException, NotFoundException;

}
