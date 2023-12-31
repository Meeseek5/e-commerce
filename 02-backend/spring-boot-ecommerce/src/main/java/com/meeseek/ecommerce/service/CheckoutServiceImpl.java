package com.meeseek.ecommerce.service;

import com.meeseek.ecommerce.dao.CustomerRepository;
import com.meeseek.ecommerce.dto.PaymentInfo;
import com.meeseek.ecommerce.dto.Purchase;
import com.meeseek.ecommerce.dto.PurchaseResponse;
import com.meeseek.ecommerce.entity.Customer;
import com.meeseek.ecommerce.entity.Order;
import com.meeseek.ecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

//    @Autowired -> 若只有一個 Constructor，spring 會自動注入 Bean，可不加註解
    public CheckoutServiceImpl(CustomerRepository customerRepository,
                               @Value("${stripe.key.secret}") String secretKey) {
        this.customerRepository = customerRepository;

        // 初始化 Stripe API 使用 secret key
        Stripe.apiKey = secretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // 從 dto 取得 order
        // purchase 的 order 只有 totalPrice, totalQuantity 的資訊
        Order order = purchase.getOrder();

        // 產生 tracking number
        String orderTrackinNumber = generateOrderTrackinNumber();
        order.setOrderTrackingNumber(orderTrackinNumber);

        // 將 orderItems 放進 order
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // 將 shippingAddress, billingAddress 放進 order
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());

        Customer customer = purchase.getCustomer();

        //  檢查 customer 是否存在 - 從資料庫取回 customer's email
        String theEmail = customer.getEmail();
        Customer customerFromDB = customerRepository.findByEmail(theEmail);

        // customer 已經存在
        if (customerFromDB != null) {
            customer = customerFromDB;
        }

        // 將 order 放進 customer
        customer.add(order); // customer add order 同時 order 也 set customer，建立雙向關係

        // customer 存入 database
        customerRepository.save(customer);

        // return response
        return new PurchaseResponse(orderTrackinNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {

        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description","ecommerce shop purchase");
        params.put("receipt_email", paymentInfo.getReceiptEmail());

        return PaymentIntent.create(params);
    }

    private String generateOrderTrackinNumber() {
        // generate random UUID number (UUID version-4)
        return UUID.randomUUID().toString();
    }
}
