package com.yo.day1.controllers;

import com.yo.day1.common.ApiResponse;
import com.yo.day1.domain.entity.Course;
import com.yo.day1.service.CourseService;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/courses")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Course>>> getCourse() {
        return ResponseEntity.ok(ApiResponse.success(courseService.findAll()));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<Course>> getCourseById(@PathParam("id") Long id) {

        return courseService.findById(id).map(value ->
                ResponseEntity.ok(ApiResponse.success(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());

//        Optional<Course> course = courseService.findById(id);
//        if (course.isPresent()) {
//            return ResponseEntity.ok(ApiResponse.success(course.get()));
//        } else {
//            return ResponseEntity.notFound().build();
//        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Course>> create(@RequestBody Course course) {
        return ResponseEntity.ok(ApiResponse.success(courseService.save(course)));
    }
}
