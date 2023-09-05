package com.meeseek.ecommerce.service;

import com.meeseek.ecommerce.dto.PaymentInfo;
import com.meeseek.ecommerce.dto.Purchase;
import com.meeseek.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
