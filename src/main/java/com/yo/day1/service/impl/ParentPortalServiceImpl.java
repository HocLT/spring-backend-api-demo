package com.yo.day1.service.impl;

import com.yo.day1.common.exception.BadRequestException;
import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.User;
import com.yo.day1.domain.enums.NotificationRecipientType;
import com.yo.day1.domain.enums.UserRole;
import com.yo.day1.dto.parent.InvoiceCard;
import com.yo.day1.dto.parent.NotificationCard;
import com.yo.day1.dto.parent.ParentDashboardResponse;
import com.yo.day1.dto.parent.StudentCard;
import com.yo.day1.repository.NotificationRepository;
import com.yo.day1.repository.TuitionInvoiceRepository;
import com.yo.day1.service.AuthService;
import com.yo.day1.service.ParentPortalService;
import com.yo.day1.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParentPortalServiceImpl implements ParentPortalService {
    private final AuthService authService;
    private final StudentService studentService;
    private final TuitionInvoiceRepository tuitionInvoiceRepository;
    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public ParentDashboardResponse getDashboard(String username) throws BadRequestException, NotFoundException {
        User user = authService.findActiveUserByUsername(username);
        if (user.getRole() != UserRole.PARENT || user.getParent() == null) {
            throw new BadRequestException("Current user is not a parent account");
        }

        Long parentId = user.getParent().getId();
        List<StudentCard> students = studentService.findByParentId(parentId).stream()
                .map(s -> new StudentCard(
                        s.getId(), s.getStudentCode(), s.getFullName(), s.getStatus().toString(), s.getLatestScore()))
                .toList();

        List<InvoiceCard> invoices = tuitionInvoiceRepository.findByStudentParentId(parentId).stream()
                .map(i -> new InvoiceCard(
                        i.getId(),
                        i.getInvoiceCode(),
                        i.getStudent().getFullName(),
                        i.getCourseClass().getName(),
                        i.getBillingMonth(),
                        i.getFinalAmount(),
                        i.getAmountPaid(),
                        i.getBalanceAmount(),
                        i.getStatus().name(),
                        i.getDueDate()
                ))
                .toList();

        List<NotificationCard> notifications = notificationRepository
                .findByRecipientTypeAndRecipientRefIdOrderByCreatedAtDesc(NotificationRecipientType.PARENT, parentId)
                .stream()
                .map(n -> new NotificationCard(
                        n.getId(),
                        n.getType().name(),
                        n.getTitle(),
                        n.getContent(),
                        n.getIsRead(),
                        n.getCreatedAt()
                ))
                .toList();

        return new ParentDashboardResponse(
                parentId,
                user.getParent().getFullName(),
                user.getUsername(),
                students,
                invoices,
                notifications
        );
    }
}
