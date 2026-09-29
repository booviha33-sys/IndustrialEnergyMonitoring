package com.example.demo.controller;

import com.example.demo.entity.CustomerInvoice;
import com.example.demo.entity.SalesOrder;
import com.example.demo.repository.CustomerInvoiceRepository;
import com.example.demo.repository.SalesOrderRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/customer-invoices")
public class CustomerInvoiceController {

    private final CustomerInvoiceRepository repository;
    private final SalesOrderRepository salesOrderRepository;

    public CustomerInvoiceController(
            CustomerInvoiceRepository repository,
            SalesOrderRepository salesOrderRepository) {

        this.repository = repository;
        this.salesOrderRepository = salesOrderRepository;
    }

    @PostMapping
    public CustomerInvoice create(
            @RequestBody CustomerInvoice invoice) {

        SalesOrder order =
                salesOrderRepository
                        .findById(invoice.getSalesOrderId())
                        .orElseThrow();

        invoice.setCustomerId(order.getCustomerId());
        invoice.setProductId(order.getProductId());
        invoice.setQuantity(order.getQuantity());
        invoice.setUnitPrice(order.getUnitPrice());

        invoice.setTotalAmount(
                invoice.getQuantity()
                * invoice.getUnitPrice()
        );

        if (invoice.getInvoiceDate() == null) {
            invoice.setInvoiceDate(LocalDate.now());
        }

        if (invoice.getDueDate() == null) {
            invoice.setDueDate(
                    invoice.getInvoiceDate().plusDays(30)
            );
        }

        if (invoice.getStatus() == null) {
            invoice.setStatus("UNPAID");
        }

        order.setStatus("INVOICED");
        salesOrderRepository.save(order);

        return repository.save(invoice);
    }

    @GetMapping
    public List<CustomerInvoice> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public CustomerInvoice getById(
            @PathVariable Long id) {

        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}/status")
    public CustomerInvoice updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        CustomerInvoice invoice =
                repository.findById(id).orElseThrow();

        invoice.setStatus(status);

        return repository.save(invoice);
    }
}