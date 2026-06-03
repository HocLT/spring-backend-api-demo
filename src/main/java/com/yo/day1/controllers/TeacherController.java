package com.yo.day1.controllers;

import com.yo.day1.common.ApiResponse;
import com.yo.day1.dto.teacher.TeacherResponse;
import com.yo.day1.dto.teacher.TeacherUpsertRequest;
import com.yo.day1.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping(value="/api/teachers")
public class TeacherController {
    private final TeacherService teacherService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_STAFF')")
    public ApiResponse<List<TeacherResponse>> findAll() {
        return ApiResponse.success(teacherService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_STAFF')")
    public ApiResponse<TeacherResponse> findById(@PathVariable long id) {
        Optional<TeacherResponse> response = teacherService.findById(id);
        if (response.isPresent()) {
            return ApiResponse.success(response.get());
        } else {
            return ApiResponse.error("Teacher not found", new TeacherResponse());
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiResponse<TeacherResponse> save(@Valid @RequestBody TeacherUpsertRequest req) {
        return ApiResponse.success(teacherService.save(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiResponse<TeacherResponse> update(@PathVariable long id, @Valid @RequestBody TeacherUpsertRequest req) {
        return ApiResponse.success(teacherService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable long id) {
        teacherService.delete(id);
        return ApiResponse.success(null);
    }
}
