package com.example.demo.repository;

import com.example.demo.entity.MunicipalPayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MunicipalPaymentRepository
        extends JpaRepository<MunicipalPayment, Long> {
}