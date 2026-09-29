package com.example.demo.controller;

import com.example.demo.entity.CustomerInvoice;
import com.example.demo.entity.MunicipalPayment;
import com.example.demo.repository.CustomerInvoiceRepository;
import com.example.demo.repository.MunicipalPaymentRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/municipal-payments")
public class MunicipalPaymentController {

    private final MunicipalPaymentRepository paymentRepository;
    private final CustomerInvoiceRepository invoiceRepository;

    public MunicipalPaymentController(
            MunicipalPaymentRepository paymentRepository,
            CustomerInvoiceRepository invoiceRepository) {

        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @PostMapping
    public MunicipalPayment create(
            @RequestBody MunicipalPayment payment) {

        CustomerInvoice invoice =
                invoiceRepository
                        .findById(payment.getCustomerInvoiceId())
                        .orElseThrow();

        payment.setCustomerId(invoice.getCustomerId());

        if (payment.getAmount() <= 0) {
            payment.setAmount(invoice.getTotalAmount());
        }

        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDate.now());
        }

        if (payment.getStatus() == null) {
            payment.setStatus("COMPLETED");
        }

        invoice.setStatus("PAID");
        invoiceRepository.save(invoice);

        return paymentRepository.save(payment);
    }

    @GetMapping
    public List<MunicipalPayment> getAll() {
        return paymentRepository.findAll();
    }

    @GetMapping("/{id}")
    public MunicipalPayment getById(
            @PathVariable Long id) {

        return paymentRepository
                .findById(id)
                .orElseThrow();
    }
}