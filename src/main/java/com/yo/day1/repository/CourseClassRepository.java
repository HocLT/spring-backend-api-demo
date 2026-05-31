package com.yo.day1.repository;

import com.yo.day1.domain.entity.CourseClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseClassRepository extends JpaRepository<CourseClass, Long> {
}
