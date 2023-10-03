package com.meeseek.ecommerce.dao;


import com.meeseek.ecommerce.entity.Customer;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    @Operation(summary = "使用 Emil 查詢 Customer ")
    Customer findByEmail(String theEmail);
}
