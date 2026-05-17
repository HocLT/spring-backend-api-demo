package com.yo.day1.dto.course;

import lombok.Data;

@Data
public class CourseResponse {

    private Long id;

    private String courseCode;

    private String name;

    private String description;

    private double tuitionFee;

    private int totalSessions;

    private byte isActive;
}
