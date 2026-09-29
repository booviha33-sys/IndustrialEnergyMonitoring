package com.example.demo.controller;

import com.example.demo.entity.RepairBill;
import com.example.demo.repository.RepairBillRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/repair-bills")
public class RepairBillController {

    private final RepairBillRepository repository;

    public RepairBillController(
            RepairBillRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public RepairBill create(
            @RequestBody RepairBill bill) {

        bill.setTotalAmount(
                bill.getQuantity()
                * bill.getUnitPrice()
        );

        if (bill.getBillDate() == null) {
            bill.setBillDate(LocalDate.now());
        }

        if (bill.getDueDate() == null) {
            bill.setDueDate(
                    bill.getBillDate().plusDays(30)
            );
        }

        if (bill.getStatus() == null) {
            bill.setStatus("UNPAID");
        }

        return repository.save(bill);
    }

    @GetMapping
    public List<RepairBill> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public RepairBill getById(
            @PathVariable Long id) {

        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}/status")
    public RepairBill updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        RepairBill bill =
                repository.findById(id).orElseThrow();

        bill.setStatus(status);

        return repository.save(bill);
    }
}