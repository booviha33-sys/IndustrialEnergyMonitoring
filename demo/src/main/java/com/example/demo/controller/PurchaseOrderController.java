package com.example.demo.controller;

import com.example.demo.entity.PurchaseOrder;
import com.example.demo.repository.PurchaseOrderRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderRepository repository;

    public PurchaseOrderController(
            PurchaseOrderRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public PurchaseOrder create(
            @RequestBody PurchaseOrder order) {

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
    public List<PurchaseOrder> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public PurchaseOrder getById(
            @PathVariable Long id) {

        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}/status")
    public PurchaseOrder updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        PurchaseOrder order =
                repository.findById(id).orElseThrow();

        order.setStatus(status);

        return repository.save(order);
    }
}