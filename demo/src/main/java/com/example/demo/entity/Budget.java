package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String budgetCode;
    private Long analyticAccountId;

    private double plannedEnergyBudget;
    private double plannedRepairBudget;
    private double totalPlannedBudget;

    private double actualEnergyExpense;
    private double actualRepairExpense;
    private double totalActualExpense;

    private double variance;

    private LocalDate startDate;
    private LocalDate endDate;

    private String status;

    public Long getId() {
        return id;
    }

    public String getBudgetCode() {
        return budgetCode;
    }

    public void setBudgetCode(String budgetCode) {
        this.budgetCode = budgetCode;
    }

    public Long getAnalyticAccountId() {
        return analyticAccountId;
    }

    public void setAnalyticAccountId(Long analyticAccountId) {
        this.analyticAccountId = analyticAccountId;
    }

    public double getPlannedEnergyBudget() {
        return plannedEnergyBudget;
    }

    public void setPlannedEnergyBudget(double plannedEnergyBudget) {
        this.plannedEnergyBudget = plannedEnergyBudget;
    }

    public double getPlannedRepairBudget() {
        return plannedRepairBudget;
    }

    public void setPlannedRepairBudget(double plannedRepairBudget) {
        this.plannedRepairBudget = plannedRepairBudget;
    }

    public double getTotalPlannedBudget() {
        return totalPlannedBudget;
    }

    public void setTotalPlannedBudget(double totalPlannedBudget) {
        this.totalPlannedBudget = totalPlannedBudget;
    }

    public double getActualEnergyExpense() {
        return actualEnergyExpense;
    }

    public void setActualEnergyExpense(double actualEnergyExpense) {
        this.actualEnergyExpense = actualEnergyExpense;
    }

    public double getActualRepairExpense() {
        return actualRepairExpense;
    }

    public void setActualRepairExpense(double actualRepairExpense) {
        this.actualRepairExpense = actualRepairExpense;
    }

    public double getTotalActualExpense() {
        return totalActualExpense;
    }

    public void setTotalActualExpense(double totalActualExpense) {
        this.totalActualExpense = totalActualExpense;
    }

    public double getVariance() {
        return variance;
    }

    public void setVariance(double variance) {
        this.variance = variance;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}