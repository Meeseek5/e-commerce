package com.meeseek.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "order_item")
@Getter
@Setter
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @JsonIgnore
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "unit_price")
    private int unitPrice;

    @Column(name = "product_id")
    private Long productId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;
}
