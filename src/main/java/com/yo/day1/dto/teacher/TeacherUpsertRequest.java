package com.yo.day1.dto.teacher;

import com.yo.day1.domain.enums.TeacherRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TeacherUpsertRequest {
    @NotBlank(message = "Teacher code is required")
    @Size(max = 20, message = "Teacher code must be at most 20 characters")
    private String teacherCode;

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must be at most 100 characters")
    private String fullName;

    @NotBlank(message = "Phone is required")
    @Size(max = 20, message = "Phone must be at most 20 characters")
    private String phone;

    @Email(message = "Email format is invalid")
    @Size(max = 100, message = "Email must be at most 100 characters")
    private String email;

    @NotNull(message = "Teacher role is required")
    private TeacherRole teacherRole;

    @Size(max = 255, message = "CCCD Image URL must be at most 255 characters")
    private String cccdImageUrl;

    private Boolean isActive = true;
}
