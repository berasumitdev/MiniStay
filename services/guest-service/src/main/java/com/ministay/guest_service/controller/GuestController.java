package com.ministay.guest_service.controller;

import com.ministay.guest_service.dto.ApiResponse;
import com.ministay.guest_service.dto.GuestDto;
import com.ministay.guest_service.entity.Guest;
import com.ministay.guest_service.service.GuestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guest")
@RequiredArgsConstructor
public class GuestController {

    private final GuestService guestService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "service", "guest-service",
                "status", "UP",
                "timestamp", LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/guests")
    public ResponseEntity<ApiResponse<List<GuestDto.Response>>> getAllGuests() {
        return ResponseEntity.ok(ApiResponse.success(guestService.getAllGuests(), "Guests fetched successfully"));
    }

    @GetMapping("/guests/{id}")
    public ResponseEntity<ApiResponse<GuestDto.Response>> getGuestById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(guestService.getGuestById(id)));
    }

    @GetMapping("/guests/email/{email}")
    public ResponseEntity<ApiResponse<GuestDto.Response>> getGuestByEmail(@PathVariable String email) {
        return ResponseEntity.ok(ApiResponse.success(guestService.getGuestByEmail(email)));
    }

    @GetMapping("/guests/search")
    public ResponseEntity<ApiResponse<List<GuestDto.Response>>> searchGuests(@RequestParam String name) {
        return ResponseEntity.ok(ApiResponse.success(guestService.searchGuests(name)));
    }

    @PostMapping("/guests")
    public ResponseEntity<ApiResponse<GuestDto.Response>> createGuest(@Valid @RequestBody GuestDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(guestService.createGuest(request), "Guest registered successfully"));
    }

    @PutMapping("/guests/{id}")
    public ResponseEntity<ApiResponse<GuestDto.Response>> updateGuest(
            @PathVariable Long id, @Valid @RequestBody GuestDto.Request request) {
        return ResponseEntity.ok(ApiResponse.success(guestService.updateGuest(id, request), "Guest updated successfully"));
    }

    @PatchMapping("/guests/{id}/status")
    public ResponseEntity<ApiResponse<GuestDto.Response>> updateGuestStatus(
            @PathVariable Long id, @RequestParam Guest.GuestStatus status) {
        return ResponseEntity.ok(ApiResponse.success(guestService.updateGuestStatus(id, status), "Status updated"));
    }

    @DeleteMapping("/guests/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGuest(@PathVariable Long id) {
        guestService.deleteGuest(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Guest deleted successfully"));
    }
}