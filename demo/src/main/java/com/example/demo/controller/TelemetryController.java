package com.example.demo.controller;

import com.example.demo.entity.Telemetry;
import com.example.demo.repository.TelemetryRepository;
import com.example.demo.service.TelemetryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/telemetry")
public class TelemetryController {

    private final TelemetryRepository repository;
    private final TelemetryService telemetryService;

    public TelemetryController(
            TelemetryRepository repository,
            TelemetryService telemetryService) {

        this.repository = repository;
        this.telemetryService = telemetryService;
    }

    @PostMapping
    public Telemetry createTelemetry(
            @RequestBody Telemetry telemetry) {

        return telemetryService
                .processTelemetry(telemetry);
    }

    @GetMapping
    public List<Telemetry> getAllTelemetry() {
        return repository.findAll();
    }

    @GetMapping("/street-light/{streetLightId}")
    public List<Telemetry> getTelemetryByStreetLight(
            @PathVariable Long streetLightId) {

        return repository
                .findByStreetLightId(streetLightId);
    }

    @GetMapping("/{id}")
    public Telemetry getTelemetry(
            @PathVariable Long id) {

        return repository
                .findById(id)
                .orElseThrow();
    }
}