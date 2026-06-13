package com.ministay.booking_service.service;

import com.ministay.booking_service.dto.BookingDto;
import com.ministay.booking_service.entity.Booking;
import com.ministay.booking_service.exception.BookingConflictException;
import com.ministay.booking_service.exception.InvalidBookingException;
import com.ministay.booking_service.exception.ResourceNotFoundException;
import com.ministay.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;

    public List<BookingDto.Response> getAllBookings() {
        return bookingRepository.findAll().stream().map(BookingDto.Response::from).toList();
    }

    public BookingDto.Response getBookingById(Long id) {
        return bookingRepository.findById(id)
                .map(BookingDto.Response::from)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public List<BookingDto.Response> getBookingsByGuest(Long guestId) {
        return bookingRepository.findByGuestId(guestId).stream().map(BookingDto.Response::from).toList();
    }

    public List<BookingDto.Response> getBookingsByRoom(Long roomId) {
        return bookingRepository.findByRoomId(roomId).stream().map(BookingDto.Response::from).toList();
    }

    public List<BookingDto.Response> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status).stream().map(BookingDto.Response::from).toList();
    }

    public List<BookingDto.Response> getTodaysCheckIns() {
        return bookingRepository.findByCheckInDate(LocalDate.now()).stream().map(BookingDto.Response::from).toList();
    }

    public List<BookingDto.Response> getTodaysCheckOuts() {
        return bookingRepository.findByCheckOutDate(LocalDate.now()).stream().map(BookingDto.Response::from).toList();
    }

    public boolean checkAvailability(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        validateDates(checkIn, checkOut);
        return !bookingRepository.isRoomBooked(roomId, checkIn, checkOut);
    }

    @Transactional
    public BookingDto.Response createBooking(BookingDto.Request request) {
        validateDates(request.getCheckIn(), request.getCheckOut());

        if (bookingRepository.isRoomBooked(request.getRoomId(), request.getCheckIn(), request.getCheckOut())) {
            throw new BookingConflictException(
                    "Room " + request.getRoomId() + " is not available for the selected dates");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        BigDecimal totalAmount = null;
        if (request.getPricePerNight() != null) {
            totalAmount = request.getPricePerNight().multiply(BigDecimal.valueOf(nights));
        }

        Booking booking = Booking.builder()
                .guestId(request.getGuestId())
                .roomId(request.getRoomId())
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .numberOfGuests(request.getNumberOfGuests() != null ? request.getNumberOfGuests() : 1)
                .specialRequests(request.getSpecialRequests())
                .totalAmount(totalAmount)
                .bookingReference(generateReference())
                .status(Booking.BookingStatus.CONFIRMED)
                .build();

        Booking saved = bookingRepository.save(booking);
        log.info("Booking created: {}", saved.getBookingReference());
        return BookingDto.Response.from(saved);
    }

    @Transactional
    public BookingDto.Response updateBookingStatus(Long id, Booking.BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        validateStatusTransition(booking.getStatus(), status);
        booking.setStatus(status);
        return BookingDto.Response.from(bookingRepository.save(booking));
    }

    @Transactional
    public BookingDto.Response cancelBooking(Long id) {
        return updateBookingStatus(id, Booking.BookingStatus.CANCELLED);
    }

    @Transactional
    public BookingDto.Response checkIn(Long id) {
        return updateBookingStatus(id, Booking.BookingStatus.CHECKED_IN);
    }

    @Transactional
    public BookingDto.Response checkOut(Long id) {
        return updateBookingStatus(id, Booking.BookingStatus.CHECKED_OUT);
    }

    @Transactional
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
    }

    // Private helpers 

    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        if (!checkOut.isAfter(checkIn)) {
            throw new InvalidBookingException("Check-out date must be after check-in date");
        }
    }

    private void validateStatusTransition(Booking.BookingStatus current, Booking.BookingStatus next) {
        boolean valid = switch (current) {
            case CONFIRMED -> next == Booking.BookingStatus.CHECKED_IN
                    || next == Booking.BookingStatus.CANCELLED
                    || next == Booking.BookingStatus.NO_SHOW;
            case CHECKED_IN -> next == Booking.BookingStatus.CHECKED_OUT;
            case CHECKED_OUT, CANCELLED, NO_SHOW -> false;
        };
        if (!valid) {
            throw new InvalidBookingException("Cannot transition from " + current + " to " + next);
        }
    }

    private String generateReference() {
        return "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}