package com.yo.day1.domain.entity;

import com.yo.day1.domain.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "courses")
@Data
public class Course extends AuditableEntity {

    @Column(columnDefinition = "varchar(20)")
    private String courseCode;

    @Column(columnDefinition = "varchar(100)")
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "tuition_fee", columnDefinition = "decimal(12,2)")
    private double tuitionFee;

    private int totalSessions;

    private Boolean isActive = true;
}
