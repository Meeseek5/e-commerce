package com.meeseek.ecommerce.dto;

import com.meeseek.ecommerce.entity.Address;
import com.meeseek.ecommerce.entity.Customer;
import com.meeseek.ecommerce.entity.Order;
import com.meeseek.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;

    private Address ShippingAddress;

    private Address BillingAddress;

    private Order order;

    private Set<OrderItem> orderItems;

}
