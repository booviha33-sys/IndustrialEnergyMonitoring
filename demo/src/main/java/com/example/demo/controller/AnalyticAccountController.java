package com.example.demo.controller;

import com.example.demo.entity.AnalyticAccount;
import com.example.demo.repository.AnalyticAccountRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zones")
public class AnalyticAccountController {

    private final AnalyticAccountRepository repository;

    public AnalyticAccountController(
            AnalyticAccountRepository repository) {

        this.repository = repository;
    }

    @PostMapping
    public AnalyticAccount create(
            @RequestBody AnalyticAccount account) {

        if (account.getStatus() == null) {
            account.setStatus("ACTIVE");
        }

        return repository.save(account);
    }

    @GetMapping
    public List<AnalyticAccount> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public AnalyticAccount getById(
            @PathVariable Long id) {

        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public AnalyticAccount update(
            @PathVariable Long id,
            @RequestBody AnalyticAccount data) {

        AnalyticAccount account =
                repository.findById(id).orElseThrow();

        account.setAccountCode(data.getAccountCode());
        account.setAccountName(data.getAccountName());
        account.setZone(data.getZone());
        account.setDescription(data.getDescription());
        account.setStatus(data.getStatus());

        return repository.save(account);
    }
}