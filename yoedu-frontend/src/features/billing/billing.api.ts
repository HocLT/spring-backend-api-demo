import api from '../../lib/api';
import type { InvoiceResponse, InvoiceCreateRequest, PaymentResponse, PaymentCreateRequest } from '../../types/yoedu';

export const billingApi = {
  createInvoice: (data: InvoiceCreateRequest) => 
    api.post<any, InvoiceResponse>('/billing/invoices', data),
    
  getStudentInvoices: (studentId: number) => 
    api.get<any, InvoiceResponse[]>(`/billing/students/${studentId}/invoices`),
    
  createPayment: (data: PaymentCreateRequest) => 
    api.post<any, PaymentResponse>('/billing/payments', data),

  getAllPayments: () => 
    api.get<any, PaymentResponse[]>('/payments/all')
};
