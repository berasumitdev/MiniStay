package com.ministay.booking_service.controller;

import com.ministay.booking_service.dto.ApiResponse;
import com.ministay.booking_service.dto.BookingDto;
import com.ministay.booking_service.entity.Booking;
import com.ministay.booking_service.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "service", "booking-service",
                "status", "UP",
                "timestamp", LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingDto.Response>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getAllBookings(), "Bookings fetched"));
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<BookingDto.Response>> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingById(id)));
    }

    @GetMapping("/bookings/guest/{guestId}")
    public ResponseEntity<ApiResponse<List<BookingDto.Response>>> getByGuest(@PathVariable Long guestId) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingsByGuest(guestId)));
    }

    @GetMapping("/bookings/room/{roomId}")
    public ResponseEntity<ApiResponse<List<BookingDto.Response>>> getByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingsByRoom(roomId)));
    }

    @GetMapping("/bookings/status/{status}")
    public ResponseEntity<ApiResponse<List<BookingDto.Response>>> getByStatus(
            @PathVariable Booking.BookingStatus status) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingsByStatus(status)));
    }

    @GetMapping("/bookings/today/checkins")
    public ResponseEntity<ApiResponse<List<BookingDto.Response>>> todaysCheckIns() {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getTodaysCheckIns(), "Today's check-ins"));
    }

    @GetMapping("/bookings/today/checkouts")
    public ResponseEntity<ApiResponse<List<BookingDto.Response>>> todaysCheckOuts() {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getTodaysCheckOuts(), "Today's check-outs"));
    }

    @GetMapping("/bookings/availability")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkAvailability(
            @RequestParam Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        boolean available = bookingService.checkAvailability(roomId, checkIn, checkOut);
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("roomId", roomId, "checkIn", checkIn, "checkOut", checkOut, "available", available)));
    }

    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<BookingDto.Response>> createBooking(
            @Valid @RequestBody BookingDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(bookingService.createBooking(request), "Booking confirmed"));
    }

    @PatchMapping("/bookings/{id}/status")
    public ResponseEntity<ApiResponse<BookingDto.Response>> updateStatus(
            @PathVariable Long id, @RequestParam Booking.BookingStatus status) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.updateBookingStatus(id, status), "Status updated"));
    }

    @PatchMapping("/bookings/{id}/checkin")
    public ResponseEntity<ApiResponse<BookingDto.Response>> checkIn(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.checkIn(id), "Guest checked in"));
    }

    @PatchMapping("/bookings/{id}/checkout")
    public ResponseEntity<ApiResponse<BookingDto.Response>> checkOut(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.checkOut(id), "Guest checked out"));
    }

    @PatchMapping("/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingDto.Response>> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.cancelBooking(id), "Booking cancelled"));
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Booking deleted"));
    }
}