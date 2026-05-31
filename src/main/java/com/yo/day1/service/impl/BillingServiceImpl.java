package com.yo.day1.service.impl;

import com.yo.day1.common.exception.BadRequestException;
import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.Payment;
import com.yo.day1.domain.entity.Promotion;
import com.yo.day1.domain.entity.TuitionInvoice;
import com.yo.day1.domain.entity.User;
import com.yo.day1.domain.enums.DiscountType;
import com.yo.day1.domain.enums.InvoiceStatus;
import com.yo.day1.dto.billing.InvoiceCreateRequest;
import com.yo.day1.dto.billing.InvoiceResponse;
import com.yo.day1.dto.billing.PaymentCreateRequest;
import com.yo.day1.dto.billing.PaymentResponse;
import com.yo.day1.repository.PaymentRepository;
import com.yo.day1.repository.PromotionRepository;
import com.yo.day1.repository.TuitionInvoiceRepository;
import com.yo.day1.service.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {

    private final TuitionInvoiceRepository tuitionInvoiceRepository;
    private final PromotionRepository promotionRepository;
    private final StudentService studentService;
    private final CourseClassService courseClassService;
    private final AuthService authService;
    private final ModelMapper mapper;
    private final PaymentRepository paymentRepository;
    private final EnrollmentService enrollmentService;

    @Transactional
    public InvoiceResponse createInvoice(InvoiceCreateRequest request) throws NotFoundException {
        TuitionInvoice invoice = new TuitionInvoice();
        invoice.setInvoiceCode(request.getInvoiceCode());
        invoice.setStudent(studentService.getStudent(request.getStudentId()));
        invoice.setCourseClass(courseClassService.getCourseClass(request.getCourseClassId()));
        invoice.setBillingMonth(request.getBillingMonth());

        float originalAmount = request.getOriginalAmount() != 0
                ? request.getOriginalAmount()
                : (float) invoice.getCourseClass().getTuitionFee();
        invoice.setOriginalAmount(originalAmount);

        Promotion promotion = null;
        float discountAmount = 0;
        if (request.getPromotionId() != null) {
            promotion = promotionRepository.findById(request.getPromotionId())
                    .orElseThrow(() -> new NotFoundException("Promotion not found: " + request.getPromotionId()));
            discountAmount = calculateDiscount(originalAmount, promotion);
        }

        float finalAmount = originalAmount - discountAmount;
        invoice.setPromotion(promotion);
        invoice.setDiscountAmount(discountAmount);
        invoice.setFinalAmount(finalAmount);
        invoice.setAmountPaid(0);
        invoice.setBalanceAmount(finalAmount);
        invoice.setStatus(finalAmount == 0 ? InvoiceStatus.PAID : InvoiceStatus.UNPAID);
        invoice.setDueDate(request.getDueDate());
        invoice.setNote(request.getNote());
        return toInvoiceResponse(tuitionInvoiceRepository.save(invoice));
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> findInvoicesByStudent(Long studentId, String username) throws BadRequestException, NotFoundException {
        User user = authService.findActiveUserByUsername(username);
        if (user.getRole().name().equals("PARENT")) {
            studentService.getStudentForParent(studentId, user.getParent().getId());
        }
        return tuitionInvoiceRepository.findByStudentId(studentId).stream().map(this::toInvoiceResponse).toList();
    }

    private float calculateDiscount(float originalAmount, Promotion promotion) {
        if (promotion.getDiscountType() == DiscountType.PERCENT) {
            return originalAmount * promotion.getDiscountValue() / 100;
        }
        return promotion.getDiscountValue();
    }

    private InvoiceResponse toInvoiceResponse(TuitionInvoice item) {
        InvoiceResponse result = mapper.map(item, InvoiceResponse.class);
        result.setStudentId(item.getStudent().getId());
        result.setStudentName(item.getStudent().getFullName());
        result.setCourseClassId(item.getCourseClass().getId());
        result.setClassName(item.getCourseClass().getName());
        result.setStatus(item.getStatus().name());
        if (item.getPromotion() != null) {
            result.setPromotionId(item.getPromotion().getId());
            result.setPromotionName(item.getPromotion().getName());
        }
        return result;
    }

    @Transactional
    public PaymentResponse createPayment(PaymentCreateRequest request, String username) throws NotFoundException, BadRequestException {
        TuitionInvoice invoice = tuitionInvoiceRepository.findById(request.getInvoiceId()).orElseThrow(() -> new NotFoundException("Invoice not found: " + request.getInvoiceId()));
        if (request.getPaidAmount() <= 0) {
            throw new BadRequestException("Paid amount must be greater than 0");
        }

        User cashier = authService.findActiveUserByUsername(username);
        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setPaymentCode(request.getPaymentCode());
        payment.setPaidAmount(request.getPaidAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaidAt(request.getPaidAt());
        payment.setCashierUser(cashier);
        payment.setNote(request.getNote());
        Payment savedPayment = paymentRepository.save(payment);

        float newAmountPaid = invoice.getAmountPaid() + request.getPaidAmount();
        float balance = invoice.getFinalAmount() - newAmountPaid;
        invoice.setAmountPaid(newAmountPaid);
        invoice.setBalanceAmount(balance);
        invoice.setStatus(calculateInvoiceStatus(balance, newAmountPaid));
        tuitionInvoiceRepository.save(invoice);

        return toPaymentResponse(savedPayment);
    }

    private InvoiceStatus calculateInvoiceStatus(float balance, float amountPaid) {
        if (balance < 0) {
            return InvoiceStatus.OVERPAID;
        }
        if (balance == 0) {
            return InvoiceStatus.PAID;
        }
        if (amountPaid  > 0) {
            return InvoiceStatus.PARTIAL;
        }
        return InvoiceStatus.UNPAID;
    }

    private PaymentResponse toPaymentResponse(Payment item) {
        PaymentResponse response  = mapper.map(item, PaymentResponse.class);
        response.setInvoiceId(item.getInvoice().getId());
        response.setInvoiceCode(item.getInvoice().getInvoiceCode());
        response.setPaymentMethod(item.getPaymentMethod().toString());
        if (item.getCashierUser() != null) {
            response.setCashierUserId(item.getCashierUser().getId());
            response.setCashierUsername(item.getCashierUser().getUsername());
        }
        return response;
    }
}
