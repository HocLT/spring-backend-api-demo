package com.yo.day1.service;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.CourseClass;
import com.yo.day1.dto.courseclass.CourseClassResponse;

import java.util.List;
import java.util.Optional;

public interface CourseClassService {

    List<CourseClassResponse> findAll();

    Optional<CourseClassResponse> findById(Long id);


    CourseClass getCourseClass(Long id) throws NotFoundException;
}
