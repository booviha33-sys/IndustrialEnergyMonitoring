package com.example.demo.controller;

import com.example.demo.entity.Payment;
import com.example.demo.entity.VendorBill;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.VendorBillRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final VendorBillRepository vendorBillRepository;

    public PaymentController(
            PaymentRepository paymentRepository,
            VendorBillRepository vendorBillRepository) {

        this.paymentRepository = paymentRepository;
        this.vendorBillRepository = vendorBillRepository;
    }

    @PostMapping
    public Payment create(
            @RequestBody Payment payment) {

        VendorBill bill =
                vendorBillRepository
                        .findById(payment.getVendorBillId())
                        .orElseThrow();

        if (payment.getAmount() <= 0) {
            payment.setAmount(bill.getTotalAmount());
        }

        payment.setVendorId(bill.getVendorId());

        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDate.now());
        }

        if (payment.getStatus() == null) {
            payment.setStatus("COMPLETED");
        }

        bill.setStatus("PAID");
        vendorBillRepository.save(bill);

        return paymentRepository.save(payment);
    }

    @GetMapping
    public List<Payment> getAll() {
        return paymentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Payment getById(
            @PathVariable Long id) {

        return paymentRepository.findById(id).orElseThrow();
    }
}