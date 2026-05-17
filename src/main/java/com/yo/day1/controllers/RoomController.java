package com.yo.day1.controllers;

import com.yo.day1.common.ApiResponse;
import com.yo.day1.dto.room.RoomResponse;
import com.yo.day1.dto.room.RoomUpsertRequest;
import com.yo.day1.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping(value="/api/rooms")
public class RoomController {
    private final RoomService roomService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiResponse<List<RoomResponse>> findAll() {
        return ApiResponse.success(roomService.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<RoomResponse> findById(@PathVariable long id) {
//        roomService.findById(id).map(ApiResponse::success).orElseGet(()->ApiResponse.error("Not found", new RoomResponse()));

        Optional<RoomResponse> roomResponse = roomService.findById(id);
        if (roomResponse.isPresent()) {
            return ApiResponse.success(roomResponse.get());
        } else {
            return ApiResponse.error("Room not found", new RoomResponse());
        }
    }

    @PostMapping
    public ApiResponse<RoomResponse> save(@RequestBody RoomUpsertRequest req) {
        return ApiResponse.success(roomService.save(req));
    }

    @PutMapping(value = "/{id}")
    public ApiResponse<RoomResponse> update(@PathVariable long id, @RequestBody RoomUpsertRequest req) {
        return ApiResponse.success(roomService.save(id, req));
    }
}
