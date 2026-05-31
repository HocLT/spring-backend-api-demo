package com.yo.day1.service.impl;

import com.yo.day1.common.exception.BadRequestException;
import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.CourseClass;
import com.yo.day1.domain.entity.Enrollment;
import com.yo.day1.domain.entity.Student;
import com.yo.day1.domain.enums.EnrollmentStatus;
import com.yo.day1.dto.enrollment.EnrollmentCreateRequest;
import com.yo.day1.dto.enrollment.EnrollmentResponse;
import com.yo.day1.repository.EnrollmentRepository;
import com.yo.day1.service.CourseClassService;
import com.yo.day1.service.EnrollmentService;
import com.yo.day1.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final StudentService studentService;
    private final CourseClassService courseClassService;
    private final ModelMapper mapper;

    @Transactional
    public EnrollmentResponse create(EnrollmentCreateRequest request) throws BadRequestException, NotFoundException {
        if (enrollmentRepository.existsByStudentIdAndCourseClassId(request.getStudentId(), request.getCourseClassId())) {
            throw new BadRequestException("Student is already enrolled in this class");
        }

        CourseClass courseClass = courseClassService.getCourseClass(request.getCourseClassId());
        long activeCount = enrollmentRepository.countByCourseClassIdAndStatus(request.getCourseClassId(), EnrollmentStatus.ACTIVE);
        if (activeCount >= courseClass.getMaxStudents()) {
            throw new BadRequestException("Class is full");
        }

        Student student = studentService.getStudent(request.getStudentId());
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourseClass(courseClass);
        enrollment.setEnrolledAt(request.getEnrolledAt());
        enrollment.setStatus(request.getStatus());
        enrollment.setNote(request.getNote());
        return toResponse(enrollmentRepository.save(enrollment));
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> findByClassId(Long classId) {
        return enrollmentRepository.findByCourseClassId(classId).stream().map(this::toResponse).toList();
    }

    public Enrollment getEnrollment(Long studentId, Long classId) throws BadRequestException {
        return enrollmentRepository.findByStudentIdAndCourseClassId(studentId, classId)
                .orElseThrow(() -> new BadRequestException("Enrollment not found for student and class"));
    }

    private EnrollmentResponse toResponse(Enrollment enrollment) {
        EnrollmentResponse result = mapper.map(enrollment, EnrollmentResponse.class);
        result.setStudentId(enrollment.getStudent().getId());
        result.setStudentName(enrollment.getStudent().getFullName());
        result.setCourseClassId(enrollment.getCourseClass().getId());
        result.setClassName(enrollment.getCourseClass().getName());
        result.setStatus(enrollment.getStatus().toString());
        return result;
    }
}
