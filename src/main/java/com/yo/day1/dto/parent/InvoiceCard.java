package com.yo.day1.dto.parent;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceCard {
    private Long id;
    private String invoiceCode;
    private String studentName;
    private String className;
    private LocalDate billingMonth;
    private float finalAmount;
    private float amountPaid;
    private float balanceAmount;
    private String status;
    private LocalDate dueDate;
}
