package com.yo.day1.repository;

import com.yo.day1.domain.entity.Enrollment;
import com.yo.day1.domain.enums.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    boolean existsByStudentIdAndCourseClassId(Long studentId, Long courseClassId);

    long countByCourseClassIdAndStatus(Long courseClassId, EnrollmentStatus status);

    java.util.List<Enrollment> findByCourseClassId(Long courseClassId);

    java.util.Optional<Enrollment> findByStudentIdAndCourseClassId(Long studentId, Long courseClassId);

    java.util.List<Enrollment> findByStudentId(Long studentId);
}

