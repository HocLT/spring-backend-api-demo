package com.yo.day1.service.impl;

import com.yo.day1.domain.entity.Teacher;
import com.yo.day1.dto.teacher.TeacherResponse;
import com.yo.day1.dto.teacher.TeacherUpsertRequest;
import com.yo.day1.repository.TeacherRepository;
import com.yo.day1.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {
    private final TeacherRepository teacherRepository;
    private final ModelMapper mapper;

    private TeacherResponse map(Teacher teacher) {
        return mapper.map(teacher, TeacherResponse.class);
    }

    @Override
    public List<TeacherResponse> findAll() {
        return teacherRepository.findAll().stream()
                .map(this::map)
                .toList();
    }

    @Override
    public Optional<TeacherResponse> findById(long id) {
        return teacherRepository.findById(id).map(this::map);
    }

    @Override
    public TeacherResponse save(TeacherUpsertRequest req) {
        Teacher teacher = mapper.map(req, Teacher.class);
        Teacher savedTeacher = teacherRepository.save(teacher);
        return map(savedTeacher);
    }

    @Override
    public TeacherResponse update(long id, TeacherUpsertRequest req) {
        Teacher teacher = mapper.map(req, Teacher.class);
        teacher.setId(id);
        Teacher savedTeacher = teacherRepository.save(teacher);
        return map(savedTeacher);
    }

    @Override
    public void delete(long id) {
        teacherRepository.deleteById(id);
    }
}
