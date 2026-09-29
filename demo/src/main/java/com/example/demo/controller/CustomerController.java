package com.example.demo.controller;

import com.example.demo.entity.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerRepository repository;

    public CustomerController(CustomerRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Customer create(@RequestBody Customer customer) {
        if (customer.getStatus() == null) {
            customer.setStatus("ACTIVE");
        }
        return repository.save(customer);
    }

    @GetMapping
    public List<Customer> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Customer getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Customer update(
            @PathVariable Long id,
            @RequestBody Customer data) {

        Customer customer = repository.findById(id).orElseThrow();

        customer.setCustomerCode(data.getCustomerCode());
        customer.setCustomerName(data.getCustomerName());
        customer.setCustomerType(data.getCustomerType());
        customer.setContactPerson(data.getContactPerson());
        customer.setPhone(data.getPhone());
        customer.setEmail(data.getEmail());
        customer.setAddress(data.getAddress());
        customer.setStatus(data.getStatus());

        return repository.save(customer);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "Customer deleted successfully";
    }
}