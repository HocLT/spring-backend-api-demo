package com.yo.day1.controllers;

import com.yo.day1.common.ApiResponse;
import com.yo.day1.dto.courseclass.CourseClassResponse;
import com.yo.day1.service.CourseClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-classes")
@RequiredArgsConstructor
public class CourseClassController {

    private final CourseClassService courseClassService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseClassResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(courseClassService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseClassResponse>> getById(@PathVariable Long id) {
        return courseClassService.findById(id)
                .map(response -> ResponseEntity.ok(ApiResponse.success(response)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
