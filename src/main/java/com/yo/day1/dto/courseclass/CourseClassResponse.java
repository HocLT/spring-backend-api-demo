package com.yo.day1.dto.courseclass;

import com.yo.day1.domain.entity.ScheduleSlot;
import com.yo.day1.domain.entity.Teacher;
import com.yo.day1.domain.enums.ClassStatus;
import com.yo.day1.dto.course.CourseResponse;
import com.yo.day1.dto.room.RoomResponse;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CourseClassResponse {

    private Long id;

    private String codeCode;

    private String name;

    private CourseResponse course;

    private RoomResponse room;

    private ScheduleSlot slot;

    private Teacher mainTeacher;

    private Teacher assistantTeacher;

    private LocalDate startDate;
    private LocalDate endDate;

    private int maxStudents;

    private double tuitionFee;

    private ClassStatus status;
}
