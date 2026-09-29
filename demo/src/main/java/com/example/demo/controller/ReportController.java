package com.example.demo.controller;

import com.example.demo.entity.Account;
import com.example.demo.entity.AnalyticAccount;
import com.example.demo.entity.Budget;
import com.example.demo.entity.JournalLine;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.AnalyticAccountRepository;
import com.example.demo.repository.BudgetRepository;
import com.example.demo.repository.JournalLineRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final AccountRepository accountRepository;
    private final JournalLineRepository journalLineRepository;
    private final BudgetRepository budgetRepository;
    private final AnalyticAccountRepository analyticAccountRepository;

    public ReportController(
            AccountRepository accountRepository,
            JournalLineRepository journalLineRepository,
            BudgetRepository budgetRepository,
            AnalyticAccountRepository analyticAccountRepository) {

        this.accountRepository = accountRepository;
        this.journalLineRepository = journalLineRepository;
        this.budgetRepository = budgetRepository;
        this.analyticAccountRepository = analyticAccountRepository;
    }

    // =========================================================
    // 1. BALANCE SHEET
    // =========================================================

    @GetMapping("/balance-sheet")
    public Map<String, Object> getBalanceSheet() {

        List<Account> accounts = accountRepository.findAll();
        List<JournalLine> lines = journalLineRepository.findAll();

        double totalAssets = 0;
        double totalLiabilities = 0;

        List<Map<String, Object>> assetDetails =
                new ArrayList<>();

        List<Map<String, Object>> liabilityDetails =
                new ArrayList<>();

        for (Account account : accounts) {

            double debit = 0;
            double credit = 0;

            for (JournalLine line : lines) {

                if (line.getAccountId() != null &&
                        line.getAccountId()
                                .equals(account.getId())) {

                    debit += line.getDebit();
                    credit += line.getCredit();
                }
            }

            double balance = debit - credit;

            // ASSETS
            if ("ASSET".equalsIgnoreCase(
                    account.getAccountType())) {

                Map<String, Object> data =
                        new LinkedHashMap<>();

                data.put("accountId", account.getId());
                data.put("accountCode",
                        account.getAccountCode());
                data.put("accountName",
                        account.getAccountName());
                data.put("balance", balance);

                assetDetails.add(data);

                totalAssets += balance;
            }

            // LIABILITIES
            if ("LIABILITY".equalsIgnoreCase(
                    account.getAccountType())) {

                double liabilityBalance =
                        credit - debit;

                Map<String, Object> data =
                        new LinkedHashMap<>();

                data.put("accountId", account.getId());
                data.put("accountCode",
                        account.getAccountCode());
                data.put("accountName",
                        account.getAccountName());
                data.put("balance",
                        liabilityBalance);

                liabilityDetails.add(data);

                totalLiabilities += liabilityBalance;
            }
        }

        Map<String, Object> result =
                new LinkedHashMap<>();

        result.put("report", "BALANCE SHEET");
        result.put("assetDetails", assetDetails);
        result.put("totalAssets", totalAssets);
        result.put("liabilityDetails", liabilityDetails);
        result.put("totalLiabilities", totalLiabilities);

        return result;
    }

    // =========================================================
    // 2. PROFIT AND LOSS
    // =========================================================

    @GetMapping("/profit-loss")
    public Map<String, Object> getProfitLoss() {

        List<Account> accounts =
                accountRepository.findAll();

        List<JournalLine> lines =
                journalLineRepository.findAll();

        double totalIncome = 0;
        double totalExpenses = 0;

        List<Map<String, Object>> incomeDetails =
                new ArrayList<>();

        List<Map<String, Object>> expenseDetails =
                new ArrayList<>();

        for (Account account : accounts) {

            double debit = 0;
            double credit = 0;

            for (JournalLine line : lines) {

                if (line.getAccountId() != null &&
                        line.getAccountId()
                                .equals(account.getId())) {

                    debit += line.getDebit();
                    credit += line.getCredit();
                }
            }

            // INCOME
            if ("INCOME".equalsIgnoreCase(
                    account.getAccountType())) {

                double incomeBalance =
                        credit - debit;

                Map<String, Object> data =
                        new LinkedHashMap<>();

                data.put("accountId", account.getId());
                data.put("accountCode",
                        account.getAccountCode());
                data.put("accountName",
                        account.getAccountName());
                data.put("amount",
                        incomeBalance);

                incomeDetails.add(data);

                totalIncome += incomeBalance;
            }

            // EXPENSE
            if ("EXPENSE".equalsIgnoreCase(
                    account.getAccountType())) {

                double expenseBalance =
                        debit - credit;

                Map<String, Object> data =
                        new LinkedHashMap<>();

                data.put("accountId", account.getId());
                data.put("accountCode",
                        account.getAccountCode());
                data.put("accountName",
                        account.getAccountName());
                data.put("amount",
                        expenseBalance);

                expenseDetails.add(data);

                totalExpenses += expenseBalance;
            }
        }

        double netProfit =
                totalIncome - totalExpenses;

        Map<String, Object> result =
                new LinkedHashMap<>();

        result.put("report", "PROFIT AND LOSS");
        result.put("incomeDetails", incomeDetails);
        result.put("totalIncome", totalIncome);
        result.put("expenseDetails", expenseDetails);
        result.put("totalExpenses", totalExpenses);
        result.put("netProfit", netProfit);

        return result;
    }

    // =========================================================
    // 3. BUDGET REPORT
    // =========================================================

    @GetMapping("/budget")
    public List<Map<String, Object>> getBudgetReport() {

        List<Budget> budgets =
                budgetRepository.findAll();

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (Budget budget : budgets) {

            String zoneName = "Unknown Zone";

            if (budget.getAnalyticAccountId() != null) {

                Optional<AnalyticAccount> zone =
                        analyticAccountRepository.findById(
                                budget.getAnalyticAccountId()
                        );

                if (zone.isPresent()) {

                    // Correct method:
                    // getAccountName()
                    zoneName =
                            zone.get().getAccountName();
                }
            }

            double plannedEnergy =
                    budget.getPlannedEnergyBudget();

            double plannedRepair =
                    budget.getPlannedRepairBudget();

            double totalPlanned =
                    plannedEnergy + plannedRepair;

            double actualEnergy =
                    budget.getActualEnergyExpense();

            double actualRepair =
                    budget.getActualRepairExpense();

            double totalActual =
                    actualEnergy + actualRepair;

            double variance =
                    totalPlanned - totalActual;

            Map<String, Object> data =
                    new LinkedHashMap<>();

            data.put("budgetId",
                    budget.getId());

            data.put("budgetCode",
                    budget.getBudgetCode());

            data.put("zone",
                    zoneName);

            data.put("plannedEnergyBudget",
                    plannedEnergy);

            data.put("plannedRepairBudget",
                    plannedRepair);

            data.put("totalPlannedBudget",
                    totalPlanned);

            data.put("actualEnergyExpense",
                    actualEnergy);

            data.put("actualRepairExpense",
                    actualRepair);

            data.put("totalActualExpense",
                    totalActual);

            data.put("variance",
                    variance);

            data.put("startDate",
                    budget.getStartDate());

            data.put("endDate",
                    budget.getEndDate());

            data.put("status",
                    budget.getStatus());

            result.add(data);
        }

        return result;
    }
}