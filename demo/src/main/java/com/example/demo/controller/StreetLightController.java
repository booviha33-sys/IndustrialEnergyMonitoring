package com.example.demo.controller;

import com.example.demo.entity.StreetLight;
import com.example.demo.entity.Telemetry;
import com.example.demo.repository.StreetLightRepository;
import com.example.demo.repository.TelemetryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/street-lights")
public class StreetLightController {

    private final StreetLightRepository streetLightRepository;
    private final TelemetryRepository telemetryRepository;

    public StreetLightController(
            StreetLightRepository streetLightRepository,
            TelemetryRepository telemetryRepository) {

        this.streetLightRepository = streetLightRepository;
        this.telemetryRepository = telemetryRepository;
    }

    @PostMapping
    public StreetLight createStreetLight(
            @RequestBody StreetLight streetLight) {

        if (streetLight.getStatus() == null) {
            streetLight.setStatus("ACTIVE");
        }

        if (streetLight.getDimmingPercentage() == 0) {
            streetLight.setDimmingPercentage(100);
        }

        return streetLightRepository.save(streetLight);
    }

    @GetMapping
    public List<StreetLight> getAllStreetLights() {
        return streetLightRepository.findAll();
    }

    @GetMapping("/{id}")
    public StreetLight getStreetLight(
            @PathVariable Long id) {

        return streetLightRepository
                .findById(id)
                .orElseThrow();
    }

    @PutMapping("/{id}/dimming")
    public StreetLight updateDimming(
            @PathVariable Long id,
            @RequestParam int percentage) {

        if (percentage < 0 || percentage > 100) {
            throw new RuntimeException(
                    "Dimming percentage must be between 0 and 100"
            );
        }

        StreetLight light =
                streetLightRepository
                        .findById(id)
                        .orElseThrow();

        light.setDimmingPercentage(percentage);

        return streetLightRepository.save(light);
    }

    @GetMapping("/power-summary")
    public List<Map<String, Object>> getPowerSummary() {

        List<StreetLight> lights =
                streetLightRepository.findAll();

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (StreetLight light : lights) {

            List<Telemetry> telemetryList =
                    telemetryRepository
                            .findByStreetLightId(light.getId());

            double totalPower = 0;
            double totalEnergy = 0;

            for (Telemetry telemetry : telemetryList) {
                totalPower += telemetry.getPower();
                totalEnergy += telemetry.getEnergyKwh();
            }

            double averagePower = 0;

            if (!telemetryList.isEmpty()) {
                averagePower =
                        totalPower / telemetryList.size();
            }

            Map<String, Object> data =
                    new LinkedHashMap<>();

            data.put("streetLightId", light.getId());
            data.put("poleNumber", light.getPoleNumber());
            data.put("zone", light.getZone());
            data.put("location", light.getLocation());
            data.put("totalPower", totalPower);
            data.put("totalEnergyKwh", totalEnergy);
            data.put("averagePower", averagePower);
            data.put(
                    "dimmingPercentage",
                    light.getDimmingPercentage()
            );

            result.add(data);
        }

        return result;
    }

    @DeleteMapping("/{id}")
    public String deleteStreetLight(
            @PathVariable Long id) {

        streetLightRepository.deleteById(id);

        return "Street light deleted successfully";
    }
}