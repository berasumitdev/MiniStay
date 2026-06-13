package com.ministay.guest_service.service;

import com.ministay.guest_service.dto.GuestDto;
import com.ministay.guest_service.entity.Guest;
import com.ministay.guest_service.exception.DuplicateResourceException;
import com.ministay.guest_service.exception.ResourceNotFoundException;
import com.ministay.guest_service.repository.GuestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GuestService {

    private final GuestRepository guestRepository;

    public List<GuestDto.Response> getAllGuests() {
        return guestRepository.findAll().stream().map(GuestDto.Response::from).toList();
    }

    public GuestDto.Response getGuestById(Long id) {
        return guestRepository.findById(id)
                .map(GuestDto.Response::from)
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found with id: " + id));
    }

    public GuestDto.Response getGuestByEmail(String email) {
        return guestRepository.findByEmail(email)
                .map(GuestDto.Response::from)
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found with email: " + email));
    }

    public List<GuestDto.Response> searchGuests(String name) {
        return guestRepository.searchByName(name).stream().map(GuestDto.Response::from).toList();
    }

    @Transactional
    public GuestDto.Response createGuest(GuestDto.Request request) {
        if (guestRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Guest already exists with email: " + request.getEmail());
        }

        Guest guest = Guest.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .idProofType(request.getIdProofType())
                .idProofNumber(request.getIdProofNumber())
                .dateOfBirth(request.getDateOfBirth())
                .nationality(request.getNationality())
                .address(request.getAddress())
                .build();

        return GuestDto.Response.from(guestRepository.save(guest));
    }

    @Transactional
    public GuestDto.Response updateGuest(Long id, GuestDto.Request request) {
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found with id: " + id));

        if (!guest.getEmail().equals(request.getEmail()) && guestRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        }

        guest.setFirstName(request.getFirstName());
        guest.setLastName(request.getLastName());
        guest.setEmail(request.getEmail());
        guest.setPhone(request.getPhone());
        if (request.getIdProofType() != null) guest.setIdProofType(request.getIdProofType());
        if (request.getIdProofNumber() != null) guest.setIdProofNumber(request.getIdProofNumber());
        if (request.getDateOfBirth() != null) guest.setDateOfBirth(request.getDateOfBirth());
        if (request.getNationality() != null) guest.setNationality(request.getNationality());
        if (request.getAddress() != null) guest.setAddress(request.getAddress());

        return GuestDto.Response.from(guestRepository.save(guest));
    }

    @Transactional
    public GuestDto.Response updateGuestStatus(Long id, Guest.GuestStatus status) {
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found with id: " + id));
        guest.setStatus(status);
        return GuestDto.Response.from(guestRepository.save(guest));
    }

    @Transactional
    public void deleteGuest(Long id) {
        if (!guestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Guest not found with id: " + id);
        }
        guestRepository.deleteById(id);
    }
}