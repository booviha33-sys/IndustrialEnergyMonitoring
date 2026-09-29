package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "telemetry")
public class Telemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long streetLightId;
    private double voltage;
    private double current;
    private double power;
    private double energyKwh;
    private double ambientLight;
    private int dimmingPercentage;
    private LocalDateTime timestamp;

    public Long getId() {
        return id;
    }

    public Long getStreetLightId() {
        return streetLightId;
    }

    public void setStreetLightId(Long streetLightId) {
        this.streetLightId = streetLightId;
    }

    public double getVoltage() {
        return voltage;
    }

    public void setVoltage(double voltage) {
        this.voltage = voltage;
    }

    public double getCurrent() {
        return current;
    }

    public void setCurrent(double current) {
        this.current = current;
    }

    public double getPower() {
        return power;
    }

    public void setPower(double power) {
        this.power = power;
    }

    public double getEnergyKwh() {
        return energyKwh;
    }

    public void setEnergyKwh(double energyKwh) {
        this.energyKwh = energyKwh;
    }

    public double getAmbientLight() {
        return ambientLight;
    }

    public void setAmbientLight(double ambientLight) {
        this.ambientLight = ambientLight;
    }

    public int getDimmingPercentage() {
        return dimmingPercentage;
    }

    public void setDimmingPercentage(int dimmingPercentage) {
        this.dimmingPercentage = dimmingPercentage;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}