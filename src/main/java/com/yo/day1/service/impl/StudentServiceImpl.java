package com.yo.day1.service.impl;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.Student;
import com.yo.day1.domain.enums.Gender;
import com.yo.day1.domain.enums.StudentStatus;
import com.yo.day1.dto.parent.ParentResponse;
import com.yo.day1.dto.student.StudentResponse;
import com.yo.day1.dto.student.StudentUpsertRequest;
import com.yo.day1.repository.ParentRepository;
import com.yo.day1.repository.StudentRepository;
import com.yo.day1.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final ModelMapper mapper;

    private StudentResponse map(Student student) {
        return mapper.map(student, StudentResponse.class);
    }

    public List<StudentResponse> findByAll() {
        return studentRepository.findAll().stream()
                .map(s->map(s))
                .toList();
    }

    public Optional<StudentResponse> findById(long id) {
        return studentRepository.findById(id)
                .map(this::map);
    }

    public StudentResponse create(StudentUpsertRequest req) {
        Student stu = mapper.map(req, Student.class);
        parentRepository.findById(req.getParentId())
                .ifPresent(p->stu.setParent(p));
        stu.setCreatedAt(LocalDateTime.now());
        stu.setUpdatedAt(LocalDateTime.now());
        Student result = studentRepository.save(stu);
        return map(result);
    }

    public StudentResponse update(Long id, StudentUpsertRequest req) {
        Student stu = mapper.map(req, Student.class);
        stu.setId(id);
        parentRepository.findById(req.getParentId())
                .ifPresent(p->stu.setParent(p));
        stu.setUpdatedAt(LocalDateTime.now());
        Student result = studentRepository.save(stu);
        return map(result);
    }

    public void delete(Long id) throws NotFoundException {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
        }  else {
            throw new NotFoundException("Delete error");
        }
    }

    private StudentResponse map2(Student student) {
        StudentResponse result = new StudentResponse();
        ParentResponse pResult = new ParentResponse();
        if (student.getParent() != null) {
            pResult.setId(student.getParent().getId());
            pResult.setFullName(student.getParent().getFullName());
            pResult.setGender(student.getParent().getGender());
            pResult.setAddress(student.getParent().getAddress());
            pResult.setPhone(student.getParent().getPhone());
            pResult.setEmail(student.getParent().getEmail());
            pResult.setRelationship(student.getParent().getRelationship());
        }

        result.setId(student.getId());
        result.setFullName(student.getFullName());
        result.setGender(student.getGender());
        result.setStudentCode(student.getStudentCode());
        result.setDateOfBirth(student.getDateOfBirth());
        result.setGradeLevel(student.getGradeLevel());
        result.setSchoolName(student.getSchoolName());
        result.setPhone(student.getPhone());
        result.setParent(pResult);
        result.setStatus(student.getStatus());
        result.setLatestScore(student.getLatestScore());
        result.setNote(student.getNote());
        result.setCreatedAt(student.getCreatedAt());
        result.setUpdatedAt(student.getUpdatedAt());

        return result;
    }
}
