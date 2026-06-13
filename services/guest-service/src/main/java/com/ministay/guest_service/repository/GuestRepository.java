package com.ministay.guest_service.repository;

import com.ministay.guest_service.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {

    Optional<Guest> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Guest> findByStatus(Guest.GuestStatus status);

    @Query("""
            SELECT g FROM Guest g
            WHERE LOWER(g.firstName) LIKE LOWER(CONCAT('%', :name, '%'))
            OR LOWER(g.lastName) LIKE LOWER(CONCAT('%', :name, '%'))
            """)
    List<Guest> searchByName(@Param("name") String name);
}