package com.yo.day1.service;

import com.yo.day1.common.exception.BadRequestException;
import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.Enrollment;
import com.yo.day1.dto.enrollment.EnrollmentCreateRequest;
import com.yo.day1.dto.enrollment.EnrollmentResponse;

import java.util.List;

public interface EnrollmentService {
    EnrollmentResponse create(EnrollmentCreateRequest request) throws BadRequestException, NotFoundException;

    List<EnrollmentResponse> findByClassId(Long classId);

    Enrollment getEnrollment(Long studentId, Long classId) throws BadRequestException;
}
