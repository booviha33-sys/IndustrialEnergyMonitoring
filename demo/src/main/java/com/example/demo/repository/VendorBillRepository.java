package com.example.demo.repository;

import com.example.demo.entity.VendorBill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendorBillRepository
        extends JpaRepository<VendorBill, Long> {
}