package com.example.demo.controller;

import com.example.demo.entity.SalesOrder;
import com.example.demo.repository.SalesOrderRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sales-orders")
public class SalesOrderController {

    private final SalesOrderRepository repository;

    public SalesOrderController(
            SalesOrderRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public SalesOrder create(
            @RequestBody SalesOrder order) {

        order.setTotalAmount(
                order.getQuantity() * order.getUnitPrice()
        );

        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDate.now());
        }

        if (order.getStatus() == null) {
            order.setStatus("DRAFT");
        }

        return repository.save(order);
    }

    @GetMapping
    public List<SalesOrder> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public SalesOrder getById(
            @PathVariable Long id) {

        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}/status")
    public SalesOrder updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        SalesOrder order =
                repository.findById(id).orElseThrow();

        order.setStatus(status);

        return repository.save(order);
    }
}