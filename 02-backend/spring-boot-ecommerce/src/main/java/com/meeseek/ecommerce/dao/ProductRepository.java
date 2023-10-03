package com.meeseek.ecommerce.dao;

import com.meeseek.ecommerce.entity.Product;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

// @CrossOrigin("http://localhost:4200") -> 在 MyDataRestCongfig 已經註冊
@RepositoryRestResource
@Tag(name = "product API - 產品 API", description = "產品操作")
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Operation(summary = "查詢 product 以 category id 為參數")
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

    @Operation(summary = "查詢 product 以關鍵字為參數")
    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);

}

