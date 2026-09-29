package com.example.demo.repository;

import com.example.demo.entity.JournalLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JournalLineRepository
        extends JpaRepository<JournalLine, Long> {

    List<JournalLine> findByJournalEntryId(Long journalEntryId);

    List<JournalLine> findByAccountId(Long accountId);
}