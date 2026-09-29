package com.example.demo.repository;

import com.example.demo.entity.Telemetry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TelemetryRepository
        extends JpaRepository<Telemetry, Long> {

    List<Telemetry> findByStreetLightId(Long streetLightId);
}