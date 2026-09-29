package com.example.demo.controller;

import com.example.demo.entity.JournalEntry;
import com.example.demo.entity.JournalLine;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.JournalEntryRepository;
import com.example.demo.repository.JournalLineRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/journals")
public class JournalController {

    private final JournalEntryRepository journalRepository;
    private final JournalLineRepository lineRepository;
    private final AccountRepository accountRepository;

    public JournalController(
            JournalEntryRepository journalRepository,
            JournalLineRepository lineRepository,
            AccountRepository accountRepository) {

        this.journalRepository = journalRepository;
        this.lineRepository = lineRepository;
        this.accountRepository = accountRepository;
    }

    @PostMapping
    public JournalEntry createJournal(
            @RequestBody JournalEntry journal) {

        if (journal.getEntryDate() == null) {
            journal.setEntryDate(LocalDate.now());
        }

        if (journal.getJournalType() == null) {
            journal.setJournalType("GENERAL");
        }

        if (journal.getStatus() == null) {
            journal.setStatus("POSTED");
        }

        if (journal.getTotalDebit() <= 0 ||
                journal.getTotalCredit() <= 0) {

            throw new RuntimeException(
                    "Debit and Credit must be greater than zero"
            );
        }

        if (Math.abs(
                journal.getTotalDebit()
                - journal.getTotalCredit()) > 0.001) {

            throw new RuntimeException(
                    "Debit and Credit must be equal"
            );
        }

        return journalRepository.save(journal);
    }

    @PostMapping("/{journalId}/lines")
    public JournalLine createLine(
            @PathVariable Long journalId,
            @RequestBody JournalLine line) {

        journalRepository
                .findById(journalId)
                .orElseThrow();

        accountRepository
                .findById(line.getAccountId())
                .orElseThrow();

        if (line.getDebit() > 0 &&
                line.getCredit() > 0) {

            throw new RuntimeException(
                    "A line cannot have both Debit and Credit"
            );
        }

        if (line.getDebit() == 0 &&
                line.getCredit() == 0) {

            throw new RuntimeException(
                    "Enter either Debit or Credit"
            );
        }

        line.setJournalEntryId(journalId);

        return lineRepository.save(line);
    }

    @GetMapping
    public List<JournalEntry> getAll() {
        return journalRepository.findAll();
    }

    @GetMapping("/{id}")
    public JournalEntry getById(
            @PathVariable Long id) {

        return journalRepository
                .findById(id)
                .orElseThrow();
    }

    @GetMapping("/{journalId}/lines")
    public List<JournalLine> getLines(
            @PathVariable Long journalId) {

        return lineRepository
                .findByJournalEntryId(journalId);
    }
}