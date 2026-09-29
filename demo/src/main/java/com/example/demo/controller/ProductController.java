package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        if (product.getStatus() == null) {
            product.setStatus("ACTIVE");
        }
        return repository.save(product);
    }

    @GetMapping
    public List<Product> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Product update(
            @PathVariable Long id,
            @RequestBody Product data) {

        Product product = repository.findById(id).orElseThrow();

        product.setProductCode(data.getProductCode());
        product.setProductName(data.getProductName());
        product.setProductType(data.getProductType());
        product.setUnit(data.getUnit());
        product.setUnitPrice(data.getUnitPrice());
        product.setDescription(data.getDescription());
        product.setStatus(data.getStatus());

        return repository.save(product);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "Product deleted successfully";
    }
}