package com.yo.day1.service;

import com.yo.day1.dto.teacher.TeacherResponse;
import com.yo.day1.dto.teacher.TeacherUpsertRequest;

import java.util.List;
import java.util.Optional;

public interface TeacherService {
    List<TeacherResponse> findAll();
    Optional<TeacherResponse> findById(long id);
    TeacherResponse save(TeacherUpsertRequest req);
    TeacherResponse update(long id, TeacherUpsertRequest req);
    void delete(long id);
}
