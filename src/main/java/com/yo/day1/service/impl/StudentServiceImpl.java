package com.yo.day1.service.impl;

import com.yo.day1.domain.entity.Student;
import com.yo.day1.repository.StudentRepository;
import com.yo.day1.service.StudentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> findByAll() {
        return studentRepository.findAll();
    }
}
