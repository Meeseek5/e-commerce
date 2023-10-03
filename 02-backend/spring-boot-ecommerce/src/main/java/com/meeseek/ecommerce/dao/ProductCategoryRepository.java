package com.meeseek.ecommerce.dao;

import com.meeseek.ecommerce.entity.ProductCategory;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

// @CrossOrigin("http://localhost:4200") -> 在 MyDataRestCongfig 已經註冊
@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-category")
@Tag(name = "product-category API - 產品類別 API", description = "產品類別操作")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
