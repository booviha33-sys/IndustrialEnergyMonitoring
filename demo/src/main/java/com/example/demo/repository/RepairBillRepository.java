package com.example.demo.repository;

import com.example.demo.entity.RepairBill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepairBillRepository
        extends JpaRepository<RepairBill, Long> {
}