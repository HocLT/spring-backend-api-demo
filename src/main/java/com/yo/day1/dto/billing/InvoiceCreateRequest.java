package com.yo.day1.dto.billing;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InvoiceCreateRequest {
    //@Schema(description = "Unique invoice code.", example = "INV-2026-001")
    @NotNull
    String invoiceCode;
    //@Schema(description = "Student identifier receiving the invoice.", example = "1")

    @NotNull
    Long studentId;

    //@Schema(description = "Course class identifier billed.", example = "3")
    @NotNull
    Long courseClassId;
    //@Schema(description = "Billing month represented by a date in that month.", example = "2026-06-01")

    @NotNull
    LocalDate billingMonth;

    //@Schema(description = "Original amount before discount.", example = "2800000", nullable = true)
    @DecimalMin("0.0")
    float originalAmount;

    //@Schema(description = "Optional promotion identifier.", example = "2", nullable = true)
    Long promotionId;

    //@Schema(description = "Payment due date.", example = "2026-06-15", nullable = true)
    LocalDate dueDate;

    //@Schema(description = "Extra billing note.", example = "Early bird discount applied.", nullable = true)
    @Size(max = 255)
    String note;
}
