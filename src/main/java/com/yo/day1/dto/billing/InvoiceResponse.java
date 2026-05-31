package com.yo.day1.dto.billing;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InvoiceResponse {

    //@Schema(description = "Invoice identifier.", example = "1")
    Long id;

    //@Schema(description = "Invoice code.", example = "INV-2026-001")
    String invoiceCode;

    //@Schema(description = "Student identifier.", example = "1")
    Long studentId;

    //@Schema(description = "Student full name.", example = "Nguyen Van A")
    String studentName;

    //@Schema(description = "Course class identifier.", example = "3")
    Long courseClassId;

    //@Schema(description = "Course class name.", example = "English Beginner - Morning")
    String className;

    //@Schema(description = "Billing month.", example = "2026-06-01")
    LocalDate billingMonth;

    //@Schema(description = "Original amount before discount.", example = "2800000")
    float originalAmount;

    //@Schema(description = "Discount amount applied.", example = "300000")
    float discountAmount;

    //@Schema(description = "Final amount after discount.", example = "2500000")
    float finalAmount;

    //@Schema(description = "Amount already paid.", example = "1000000")
    float amountPaid;

    //@Schema(description = "Remaining balance.", example = "1500000")
    float balanceAmount;

    //@Schema(description = "Invoice status.", example = "PARTIALLY_PAID")
    String status;

    //@Schema(description = "Promotion identifier.", example = "2", nullable = true)
    Long promotionId;

    //@Schema(description = "Promotion name.", example = "Summer discount", nullable = true)
    String promotionName;

    //@Schema(description = "Due date.", example = "2026-06-15", nullable = true)
    LocalDate dueDate;

    //@Schema(description = "Billing note.", example = "Early bird discount applied.", nullable = true)
    String note;

    //@Schema(description = "Creation timestamp.", example = "2026-05-24T10:00:00")
    LocalDateTime createdAt;

    //@Schema(description = "Last update timestamp.", example = "2026-05-24T11:30:00")
    LocalDateTime updatedAt;
}
