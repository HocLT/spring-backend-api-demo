package com.yo.day1.service.impl;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.Course;
import com.yo.day1.domain.entity.CourseClass;
import com.yo.day1.dto.courseclass.CourseClassResponse;
import com.yo.day1.dto.courseclass.CourseClassUpsertRequest;
import com.yo.day1.repository.*;
import com.yo.day1.service.CourseClassService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseClassServiceImpl implements CourseClassService {

    private final CourseClassRepository courseClassRepository;

    private final ScheduleSlotRepository scheduleSlotRepository;

    private final CourseRepository courseRepository;

    private final TeacherRepository teacherRepository;

    private final RoomRepository roomRepository;

    private final ModelMapper mapper;

    CourseClassResponse toCourseClassResponse(CourseClass cc) {
        return mapper.map(cc, CourseClassResponse.class);
    }

    CourseClass copyToCourseClass(CourseClassUpsertRequest req, CourseClass cc) {

        if (req.getCourseId() != null) {
            courseRepository.findById(req.getCourseId()).ifPresent(cc::setCourse);
        }

        if (req.getScheduleSlotId() != null) {
            scheduleSlotRepository.findById(req.getScheduleSlotId()).ifPresent(cc::setSlot);
        }

        if (req.getRoomId() != null) {
            roomRepository.findById(req.getRoomId()).ifPresent(cc::setRoom);
        }

        if (req.getMainTeacherId() != null) {
            teacherRepository.findById(req.getMainTeacherId()).ifPresent(cc::setMainTeacher);
        }

        if (req.getAssistantTeacherId() != null) {
            teacherRepository.findById(req.getAssistantTeacherId()).ifPresent(cc::setAssistantTeacher);
        }

        return cc;
    }

    public List<CourseClassResponse> findAll() {
        return courseClassRepository.findAll().stream()
                .map(this::toCourseClassResponse)
                .toList();
    }

    public Optional<CourseClassResponse> findById(Long id) {
        return courseClassRepository.findById(id)
                .map(this::toCourseClassResponse);
    }

    public CourseClassResponse create(CourseClassUpsertRequest req) {
        CourseClass cc = mapper.map(req, CourseClass.class);
        copyToCourseClass(req, cc);

        CourseClass result = courseClassRepository.save(cc);
        return toCourseClassResponse(result);
    }

    public CourseClassResponse update(Long id, CourseClassUpsertRequest req) throws NotFoundException {
        Optional<CourseClass> courseClass = courseClassRepository.findById(id);
        if (courseClass.isPresent()) {
            CourseClass cc = courseClass.get();

            copyToCourseClass(req, cc);

            CourseClass result = courseClassRepository.save(cc);
            return toCourseClassResponse(result);
        } else {
            throw new NotFoundException("Course not exists");
        }
    }
}
