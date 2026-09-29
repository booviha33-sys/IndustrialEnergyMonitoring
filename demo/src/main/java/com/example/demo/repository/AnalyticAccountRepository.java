package com.example.demo.repository;

import com.example.demo.entity.AnalyticAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticAccountRepository
        extends JpaRepository<AnalyticAccount, Long> {
}