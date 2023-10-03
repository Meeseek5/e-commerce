package com.meeseek.ecommerce.dao;

import com.meeseek.ecommerce.entity.Order;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;
import java.util.Optional;


@Tag(name = "Order API - 訂單 API", description = "訂單操作")
@RepositoryRestResource
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Operation(summary = "使用 Emil 查詢 Order 分頁並隨時間遞減排序 ")
    Page<Order> findByCustomerEmailOrderByDateCreatedDesc(@Param("email") String email, Pageable pageable);

    /*
    /api/orders -> 此資源在 SecurityConfig 中有限制，必須經過身份認證後才可以存取
     */

    @Override
    @RestResource(exported = false)
    Optional<Order> findById(Long aLong);

    @Override
    @RestResource(exported = false)
    Page<Order> findAll(Pageable pageable);
}