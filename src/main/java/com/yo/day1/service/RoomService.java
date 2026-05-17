package com.yo.day1.service;

import com.yo.day1.dto.room.RoomResponse;
import com.yo.day1.dto.room.RoomUpsertRequest;

import java.util.List;
import java.util.Optional;

public interface RoomService {

    List<RoomResponse> findAll();

    Optional<RoomResponse> findById(long id);

    RoomResponse save(RoomUpsertRequest req);

    RoomResponse save(long id, RoomUpsertRequest req);

}
