package com.example.demo.controller;

import com.example.demo.entity.MaintenanceTicket;
import com.example.demo.repository.MaintenanceTicketRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-tickets")
public class MaintenanceTicketController {

    private final MaintenanceTicketRepository repository;

    public MaintenanceTicketController(
            MaintenanceTicketRepository repository) {

        this.repository = repository;
    }

    @PostMapping
    public MaintenanceTicket createTicket(
            @RequestBody MaintenanceTicket ticket) {

        return repository.save(ticket);
    }

    @GetMapping
    public List<MaintenanceTicket> getAllTickets() {

        return repository.findAll();
    }

    @GetMapping("/{id}")
    public MaintenanceTicket getTicket(@PathVariable Long id) {

        return repository.findById(id)
                .orElseThrow();
    }

    @GetMapping("/street-light/{streetLightId}")
    public List<MaintenanceTicket> getTicketsByStreetLight(
            @PathVariable Long streetLightId) {

        return repository.findByStreetLightId(streetLightId);
    }

    @GetMapping("/status/{status}")
    public List<MaintenanceTicket> getTicketsByStatus(
            @PathVariable String status) {

        return repository.findByStatus(status);
    }

    @PutMapping("/{id}/status")
    public MaintenanceTicket updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        MaintenanceTicket ticket = repository.findById(id)
                .orElseThrow();

        ticket.setStatus(status);

        return repository.save(ticket);
    }
}