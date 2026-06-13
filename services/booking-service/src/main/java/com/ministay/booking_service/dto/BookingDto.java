package com.ministay.booking_service.dto;

import com.ministay.booking_service.entity.Booking;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class BookingDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {

        @NotNull(message = "Guest ID is required")
        private Long guestId;

        @NotNull(message = "Room ID is required")
        private Long roomId;

        @NotNull(message = "Check-in date is required")
        @FutureOrPresent(message = "Check-in must be today or a future date")
        private LocalDate checkIn;

        @NotNull(message = "Check-out date is required")
        @Future(message = "Check-out must be a future date")
        private LocalDate checkOut;

        @Min(value = 1, message = "Number of guests must be at least 1")
        private Integer numberOfGuests;

        private String specialRequests;

        // price per night passed from frontend (fetched from property service)
        private BigDecimal pricePerNight;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private Long guestId;
        private Long roomId;
        private LocalDate checkIn;
        private LocalDate checkOut;
        private Booking.BookingStatus status;
        private BigDecimal totalAmount;
        private Integer numberOfGuests;
        private String specialRequests;
        private String bookingReference;
        private Long numberOfNights;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response from(Booking booking) {
            long nights = (booking.getCheckIn() != null && booking.getCheckOut() != null)
                    ? ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut())
                    : 0;
            return Response.builder()
                    .id(booking.getId())
                    .guestId(booking.getGuestId())
                    .roomId(booking.getRoomId())
                    .checkIn(booking.getCheckIn())
                    .checkOut(booking.getCheckOut())
                    .status(booking.getStatus())
                    .totalAmount(booking.getTotalAmount())
                    .numberOfGuests(booking.getNumberOfGuests())
                    .specialRequests(booking.getSpecialRequests())
                    .bookingReference(booking.getBookingReference())
                    .numberOfNights(nights)
                    .createdAt(booking.getCreatedAt())
                    .updatedAt(booking.getUpdatedAt())
                    .build();
        }
    }
}