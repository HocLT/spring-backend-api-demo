package com.yo.day1.controllers;

import com.yo.day1.common.ApiResponse;
import com.yo.day1.domain.entity.ScheduleSlot;
import com.yo.day1.service.ScheduleSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule-slots")
@RequiredArgsConstructor
public class ScheduleSlotController {

    private final ScheduleSlotService scheduleSlotService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleSlot>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(scheduleSlotService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduleSlot>> getById(@PathVariable Long id) {
        return scheduleSlotService.findById(id)
                .map(response -> ResponseEntity.ok(ApiResponse.success(response)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
