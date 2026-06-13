package com.ministay.property_service.dto;

import com.ministay.property_service.entity.Room;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RoomDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {

        @NotBlank(message = "Room number is required")
        private String roomNumber;

        @NotNull(message = "Room type is required")
        private Room.RoomType roomType;

        @NotNull(message = "Floor is required")
        @Min(value = 1, message = "Floor must be at least 1")
        private Integer floor;

        @NotNull(message = "Price per night is required")
        @DecimalMin(value = "0.0", inclusive = false)
        private BigDecimal pricePerNight;

        private Room.RoomStatus status;
        private String description;

        @Min(value = 1)
        private Integer capacity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String roomNumber;
        private Room.RoomType roomType;
        private Integer floor;
        private BigDecimal pricePerNight;
        private Room.RoomStatus status;
        private String description;
        private Integer capacity;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response from(Room room) {
            return Response.builder()
                    .id(room.getId())
                    .roomNumber(room.getRoomNumber())
                    .roomType(room.getRoomType())
                    .floor(room.getFloor())
                    .pricePerNight(room.getPricePerNight())
                    .status(room.getStatus())
                    .description(room.getDescription())
                    .capacity(room.getCapacity())
                    .createdAt(room.getCreatedAt())
                    .updatedAt(room.getUpdatedAt())
                    .build();
        }
    }
}