package com.ministay.property_service.repository;

import com.ministay.property_service.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByRoomNumber(String roomNumber);

    boolean existsByRoomNumber(String roomNumber);

    List<Room> findByStatus(Room.RoomStatus status);

    List<Room> findByRoomType(Room.RoomType roomType);

    List<Room> findByFloor(Integer floor);
}