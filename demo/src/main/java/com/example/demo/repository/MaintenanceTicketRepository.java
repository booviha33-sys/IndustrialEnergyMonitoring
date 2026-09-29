package com.example.demo.repository;

import com.example.demo.entity.MaintenanceTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceTicketRepository
        extends JpaRepository<MaintenanceTicket, Long> {

    List<MaintenanceTicket> findByStreetLightId(Long streetLightId);

    List<MaintenanceTicket> findByStatus(String status);
}