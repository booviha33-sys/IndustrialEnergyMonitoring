package com.example.demo.controller;

import com.example.demo.entity.Account;
import com.example.demo.repository.AccountRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountRepository repository;

    public AccountController(AccountRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Account create(@RequestBody Account account) {
        if (account.getStatus() == null) {
            account.setStatus("ACTIVE");
        }
        return repository.save(account);
    }

    @GetMapping
    public List<Account> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Account getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Account update(
            @PathVariable Long id,
            @RequestBody Account data) {

        Account account = repository.findById(id).orElseThrow();

        account.setAccountCode(data.getAccountCode());
        account.setAccountName(data.getAccountName());
        account.setAccountType(data.getAccountType());
        account.setDescription(data.getDescription());
        account.setStatus(data.getStatus());

        return repository.save(account);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "Account deleted successfully";
    }
}