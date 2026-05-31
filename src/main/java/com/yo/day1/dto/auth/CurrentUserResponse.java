package com.yo.day1.dto.auth;

public record CurrentUserResponse(
        Long id,
        String username,
        String fullName,
        String role,
        Long parentId,
        Long teacherId
) {
}
