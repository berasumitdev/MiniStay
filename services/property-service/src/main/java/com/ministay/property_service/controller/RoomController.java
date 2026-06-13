package com.ministay.property_service.controller;

import com.ministay.property_service.dto.ApiResponse;
import com.ministay.property_service.dto.RoomDto;
import com.ministay.property_service.entity.Room;
import com.ministay.property_service.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/property")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "service", "property-service",
                "status", "UP",
                "timestamp", LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<List<RoomDto.Response>>> getAllRooms() {
        return ResponseEntity.ok(ApiResponse.success(roomService.getAllRooms(), "Rooms fetched successfully"));
    }

    @GetMapping("/rooms/available")
    public ResponseEntity<ApiResponse<List<RoomDto.Response>>> getAvailableRooms() {
        return ResponseEntity.ok(ApiResponse.success(roomService.getAvailableRooms(), "Available rooms fetched"));
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<RoomDto.Response>> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(roomService.getRoomById(id)));
    }

    @PostMapping("/rooms")
    public ResponseEntity<ApiResponse<RoomDto.Response>> createRoom(@Valid @RequestBody RoomDto.Request request) {
        RoomDto.Response created = roomService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Room created successfully"));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<RoomDto.Response>> updateRoom(
            @PathVariable Long id, @Valid @RequestBody RoomDto.Request request) {
        return ResponseEntity.ok(ApiResponse.success(roomService.updateRoom(id, request), "Room updated successfully"));
    }

    @PatchMapping("/rooms/{id}/status")
    public ResponseEntity<ApiResponse<RoomDto.Response>> updateRoomStatus(
            @PathVariable Long id, @RequestParam Room.RoomStatus status) {
        return ResponseEntity.ok(ApiResponse.success(roomService.updateRoomStatus(id, status), "Status updated"));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Room deleted successfully"));
    }
}