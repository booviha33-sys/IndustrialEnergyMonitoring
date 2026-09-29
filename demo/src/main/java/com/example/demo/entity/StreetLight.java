package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "street_lights")
public class StreetLight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String poleNumber;
    private String zone;
    private String location;
    private double ratedPower;
    private int dimmingPercentage;
    private String status;

    public Long getId() {
        return id;
    }

    public String getPoleNumber() {
        return poleNumber;
    }

    public void setPoleNumber(String poleNumber) {
        this.poleNumber = poleNumber;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getRatedPower() {
        return ratedPower;
    }

    public void setRatedPower(double ratedPower) {
        this.ratedPower = ratedPower;
    }

    public int getDimmingPercentage() {
        return dimmingPercentage;
    }

    public void setDimmingPercentage(int dimmingPercentage) {
        this.dimmingPercentage = dimmingPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}