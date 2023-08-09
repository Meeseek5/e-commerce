package com.meeseek.ecommerce.service;

import com.meeseek.ecommerce.dto.Purchase;
import com.meeseek.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
