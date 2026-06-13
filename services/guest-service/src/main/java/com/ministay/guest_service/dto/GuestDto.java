package com.ministay.guest_service.dto;

import com.ministay.guest_service.entity.Guest;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class GuestDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {

        @NotBlank(message = "First name is required")
        private String firstName;

        @NotBlank(message = "Last name is required")
        private String lastName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Phone is required")
        private String phone;

        private Guest.IdProofType idProofType;
        private String idProofNumber;
        private LocalDate dateOfBirth;
        private String nationality;
        private String address;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private Guest.IdProofType idProofType;
        private String idProofNumber;
        private LocalDate dateOfBirth;
        private String nationality;
        private String address;
        private Guest.GuestStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response from(Guest guest) {
            return Response.builder()
                    .id(guest.getId())
                    .firstName(guest.getFirstName())
                    .lastName(guest.getLastName())
                    .email(guest.getEmail())
                    .phone(guest.getPhone())
                    .idProofType(guest.getIdProofType())
                    .idProofNumber(guest.getIdProofNumber())
                    .dateOfBirth(guest.getDateOfBirth())
                    .nationality(guest.getNationality())
                    .address(guest.getAddress())
                    .status(guest.getStatus())
                    .createdAt(guest.getCreatedAt())
                    .updatedAt(guest.getUpdatedAt())
                    .build();
        }
    }
}