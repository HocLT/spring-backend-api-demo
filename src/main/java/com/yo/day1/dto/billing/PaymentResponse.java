package com.yo.day1.dto.billing;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private Long id;
    private Long invoiceId;
    private String invoiceCode;
    private String paymentCode;
    private float paidAmount;
    private String paymentMethod;
    private LocalDateTime paidAt;
    private Long cashierUserId;
    private String cashierUsername;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
