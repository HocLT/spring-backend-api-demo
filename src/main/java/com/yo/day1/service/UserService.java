package com.yo.day1.service;

import com.yo.day1.common.exception.BadRequestException;
import com.yo.day1.dto.auth.CurrentUserResponse;
import com.yo.day1.dto.user.UserCreationRequest;

public interface UserService {
    CurrentUserResponse createUser(UserCreationRequest request) throws BadRequestException;
}
