package com.ministay.property_service.service;

import com.ministay.property_service.dto.RoomDto;
import com.ministay.property_service.entity.Room;
import com.ministay.property_service.exception.DuplicateResourceException;
import com.ministay.property_service.exception.ResourceNotFoundException;
import com.ministay.property_service.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomService {

    private final RoomRepository roomRepository;

    public List<RoomDto.Response> getAllRooms() {
        return roomRepository.findAll().stream().map(RoomDto.Response::from).toList();
    }

    public RoomDto.Response getRoomById(Long id) {
        return roomRepository.findById(id)
                .map(RoomDto.Response::from)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
    }

    public List<RoomDto.Response> getAvailableRooms() {
        return roomRepository.findByStatus(Room.RoomStatus.AVAILABLE)
                .stream().map(RoomDto.Response::from).toList();
    }

    @Transactional
    public RoomDto.Response createRoom(RoomDto.Request request) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new DuplicateResourceException("Room already exists with number: " + request.getRoomNumber());
        }

        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .roomType(request.getRoomType())
                .floor(request.getFloor())
                .pricePerNight(request.getPricePerNight())
                .status(request.getStatus() != null ? request.getStatus() : Room.RoomStatus.AVAILABLE)
                .description(request.getDescription())
                .capacity(request.getCapacity() != null ? request.getCapacity() : 1)
                .build();

        return RoomDto.Response.from(roomRepository.save(room));
    }

    @Transactional
    public RoomDto.Response updateRoom(Long id, RoomDto.Request request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        if (!room.getRoomNumber().equals(request.getRoomNumber())
                && roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new DuplicateResourceException("Room already exists with number: " + request.getRoomNumber());
        }

        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setFloor(request.getFloor());
        room.setPricePerNight(request.getPricePerNight());
        if (request.getStatus() != null) room.setStatus(request.getStatus());
        if (request.getDescription() != null) room.setDescription(request.getDescription());
        if (request.getCapacity() != null) room.setCapacity(request.getCapacity());

        return RoomDto.Response.from(roomRepository.save(room));
    }

    @Transactional
    public RoomDto.Response updateRoomStatus(Long id, Room.RoomStatus status) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        room.setStatus(status);
        return RoomDto.Response.from(roomRepository.save(room));
    }

    @Transactional
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }
}