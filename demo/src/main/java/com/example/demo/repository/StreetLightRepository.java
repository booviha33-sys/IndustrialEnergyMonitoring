package com.example.demo.repository;

import com.example.demo.entity.StreetLight;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StreetLightRepository
        extends JpaRepository<StreetLight, Long> {
}