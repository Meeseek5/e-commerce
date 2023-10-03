package com.meeseek.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @JsonIgnore
    private Long id;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY,  description = "訂單編號")
    @Column(name = "order_tracking_number")
    private String orderTrackingNumber;

    @Column(name = "total_price")
    private int totalPrice;

    @Column(name = "total_quantity")
    private int totalQuantity;

    @Column(name = "status")
    @JsonIgnore
    private String status;

    @Column(name = "date_created")
    @CreationTimestamp
    @Schema(accessMode = Schema.AccessMode.READ_ONLY,  description = "訂單創建時間")
    private Date dateCreated;

    @Column(name = "last_updated")
    @UpdateTimestamp
    @JsonIgnore
    private Date lastUpdated;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
    @JsonIgnore
    private Set<OrderItem> orderItems = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customer;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shipping_address_id", referencedColumnName = "id")
    @JsonIgnore
    private Address shippingAddress;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "billing_address_id", referencedColumnName = "id")
    @JsonIgnore
    private Address billingAddress;

    public void add(OrderItem item) {

        if(item != null) {
            if(orderItems == null) {
                orderItems = new HashSet<>();
            }
            orderItems.add(item);
            item.setOrder(this);
        }
    }

}
