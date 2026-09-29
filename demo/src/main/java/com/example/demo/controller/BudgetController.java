package com.example.demo.controller;

import com.example.demo.entity.Budget;
import com.example.demo.repository.BudgetRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetRepository repository;

    public BudgetController(BudgetRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Budget create(
            @RequestBody Budget budget) {

        calculateBudget(budget);

        if (budget.getStartDate() == null) {
            budget.setStartDate(LocalDate.now());
        }

        if (budget.getEndDate() == null) {
            budget.setEndDate(
                    budget.getStartDate().plusMonths(1)
            );
        }

        if (budget.getStatus() == null) {
            budget.setStatus("ACTIVE");
        }

        return repository.save(budget);
    }

    @GetMapping
    public List<Budget> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Budget getById(
            @PathVariable Long id) {

        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Budget update(
            @PathVariable Long id,
            @RequestBody Budget data) {

        Budget budget =
                repository.findById(id).orElseThrow();

        budget.setBudgetCode(data.getBudgetCode());
        budget.setAnalyticAccountId(
                data.getAnalyticAccountId()
        );
        budget.setPlannedEnergyBudget(
                data.getPlannedEnergyBudget()
        );
        budget.setPlannedRepairBudget(
                data.getPlannedRepairBudget()
        );
        budget.setActualEnergyExpense(
                data.getActualEnergyExpense()
        );
        budget.setActualRepairExpense(
                data.getActualRepairExpense()
        );
        budget.setStartDate(data.getStartDate());
        budget.setEndDate(data.getEndDate());
        budget.setStatus(data.getStatus());

        calculateBudget(budget);

        return repository.save(budget);
    }

    private void calculateBudget(Budget budget) {

        double planned =
                budget.getPlannedEnergyBudget()
                + budget.getPlannedRepairBudget();

        double actual =
                budget.getActualEnergyExpense()
                + budget.getActualRepairExpense();

        budget.setTotalPlannedBudget(planned);
        budget.setTotalActualExpense(actual);

        // Positive = remaining budget
        // Negative = budget exceeded
        budget.setVariance(planned - actual);
    }

    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id) {

        repository.deleteById(id);

        return "Budget deleted successfully";
    }
}