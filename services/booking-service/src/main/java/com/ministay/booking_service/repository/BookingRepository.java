package com.ministay.booking_service.repository;

import com.ministay.booking_service.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByGuestId(Long guestId);

    List<Booking> findByRoomId(Long roomId);

    List<Booking> findByStatus(Booking.BookingStatus status);

  @Query("SELECT b FROM Booking b WHERE b.checkIn = :date")
List<Booking> findByCheckInDate(@Param("date") LocalDate date);

@Query("SELECT b FROM Booking b WHERE b.checkOut = :date")
List<Booking> findByCheckOutDate(@Param("date") LocalDate date);

    // Returns true if the room already has an overlapping booking.
    // Ignores CANCELLED and CHECKED_OUT bookings.
    // Overlap rule: existing.checkIn < new.checkOut AND existing.checkOut > new.checkIn
    @Query("""
            SELECT COUNT(b) > 0 FROM Booking b
            WHERE b.roomId = :roomId
            AND b.status NOT IN ('CANCELLED', 'CHECKED_OUT')
            AND b.checkIn < :checkOut
            AND b.checkOut > :checkIn
            """)
    boolean isRoomBooked(
            @Param("roomId") Long roomId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );
}