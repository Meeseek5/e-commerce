package com.meeseek.ecommerce.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class PaymentInfo {

    @Schema(description = "總價格")
    private int amount;

    @Schema(description = "幣別")
    private String currency;

    @Schema(description = "帳單 email")
    private String receiptEmail;

}
