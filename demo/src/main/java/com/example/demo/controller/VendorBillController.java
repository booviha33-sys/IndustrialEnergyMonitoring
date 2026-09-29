package com.example.demo.controller;

import com.example.demo.entity.VendorBill;
import com.example.demo.entity.PurchaseOrder;
import com.example.demo.repository.VendorBillRepository;
import com.example.demo.repository.PurchaseOrderRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vendor-bills")
public class VendorBillController {

    private final VendorBillRepository repository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public VendorBillController(
            VendorBillRepository repository,
            PurchaseOrderRepository purchaseOrderRepository) {

        this.repository = repository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @PostMapping
    public VendorBill create(
            @RequestBody VendorBill bill) {

        PurchaseOrder order =
                purchaseOrderRepository
                        .findById(bill.getPurchaseOrderId())
                        .orElseThrow();

        bill.setVendorId(order.getVendorId());
        bill.setProductId(order.getProductId());
        bill.setQuantity(order.getQuantity());
        bill.setUnitPrice(order.getUnitPrice());

        bill.setTotalAmount(
                bill.getQuantity() * bill.getUnitPrice()
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

        order.setStatus("BILLED");
        purchaseOrderRepository.save(order);

        return repository.save(bill);
    }

    @GetMapping
    public List<VendorBill> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public VendorBill getById(
            @PathVariable Long id) {

        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}/status")
    public VendorBill updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        VendorBill bill =
                repository.findById(id).orElseThrow();

        bill.setStatus(status);

        return repository.save(bill);
    }
}