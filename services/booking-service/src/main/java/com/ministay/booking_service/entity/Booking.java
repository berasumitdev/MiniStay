package com.ministay.booking_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Guest ID is required")
    @Column(name = "guest_id", nullable = false)
    private Long guestId;

    @NotNull(message = "Room ID is required")
    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @NotNull(message = "Check-in date is required")
    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn;

    @NotNull(message = "Check-out date is required")
    @Column(name = "check_out", nullable = false)
    private LocalDate checkOut;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "number_of_guests")
    @Builder.Default
    private Integer numberOfGuests = 1;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @Column(name = "booking_reference", unique = true)
    private String bookingReference;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum BookingStatus {
        CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW
    }
}