package com.example.demo.controller;

import com.example.demo.entity.Vendor;
import com.example.demo.repository.VendorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    private final VendorRepository repository;

    public VendorController(VendorRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Vendor create(@RequestBody Vendor vendor) {
        if (vendor.getStatus() == null) {
            vendor.setStatus("ACTIVE");
        }
        return repository.save(vendor);
    }

    @GetMapping
    public List<Vendor> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Vendor getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Vendor update(
            @PathVariable Long id,
            @RequestBody Vendor data) {

        Vendor vendor = repository.findById(id).orElseThrow();

        vendor.setVendorCode(data.getVendorCode());
        vendor.setVendorName(data.getVendorName());
        vendor.setVendorType(data.getVendorType());
        vendor.setContactPerson(data.getContactPerson());
        vendor.setPhone(data.getPhone());
        vendor.setEmail(data.getEmail());
        vendor.setAddress(data.getAddress());
        vendor.setStatus(data.getStatus());

        return repository.save(vendor);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "Vendor deleted successfully";
    }
}