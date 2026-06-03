import api from '../../lib/api';
import type { PaymentResponse } from '../../types/yoedu';

export const paymentsApi = {
  getAll: () => 
    api.get<any, PaymentResponse[]>('/payments/all'),
    
  getById: (id: number) => 
    api.get<any, PaymentResponse>(`/payments/${id}`),
    
  getByStudentId: (studentId: number) => 
    api.get<any, PaymentResponse[]>(`/payments/student/${studentId}`)
};
