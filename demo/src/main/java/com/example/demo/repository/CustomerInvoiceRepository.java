package com.example.demo.repository;

import com.example.demo.entity.CustomerInvoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerInvoiceRepository
        extends JpaRepository<CustomerInvoice, Long> {
}