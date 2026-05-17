package com.yo.day1.service.impl;

import com.yo.day1.domain.entity.ScheduleSlot;
import com.yo.day1.repository.ScheduleSlotRepository;
import com.yo.day1.service.ScheduleSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduleSlotServiceImpl implements ScheduleSlotService {
    private final ScheduleSlotRepository scheduleSlotRepository;

    public List<ScheduleSlot> findAll() {
        return scheduleSlotRepository.findAll();
    }

    public Optional<ScheduleSlot> findById(Long id) {
        return scheduleSlotRepository.findById(id);
    }

    public ScheduleSlot save(ScheduleSlot scheduleSlot) {
        return scheduleSlotRepository.save(scheduleSlot);
    }

    public void deleteById(Long id) {
        scheduleSlotRepository.deleteById(id);
    }
}
