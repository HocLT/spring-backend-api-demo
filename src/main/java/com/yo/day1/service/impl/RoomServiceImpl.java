package com.yo.day1.service.impl;

import com.yo.day1.domain.entity.Room;
import com.yo.day1.dto.room.RoomResponse;
import com.yo.day1.dto.room.RoomUpsertRequest;
import com.yo.day1.repository.RoomRepository;
import com.yo.day1.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final ModelMapper mapper;

    private RoomResponse map(Room room) {
        return mapper.map(room, RoomResponse.class);
    }

    public List<RoomResponse> findAll() {
        return roomRepository.findAll().stream()
                //.map(this::map)
                .map(r->map(r))
                .toList();
    }

    public Optional<RoomResponse> findById(long id) {
        return roomRepository.findById(id).map(this::map);
    }

    public RoomResponse save(RoomUpsertRequest req) {
        Room room = mapper.map(req, Room.class);
        Room response = roomRepository.save(room);
        return map(response);
    }

    public RoomResponse save(long id, RoomUpsertRequest req) {
        Room room = mapper.map(req, Room.class);
        room.setId(id);
        Room response = roomRepository.save(room);
        return map(response);
    }
}
