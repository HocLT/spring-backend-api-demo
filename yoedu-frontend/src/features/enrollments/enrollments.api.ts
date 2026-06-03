import api from '../../lib/api';
import type { EnrollmentResponse, EnrollmentCreateRequest } from '../../types/yoedu';

export const enrollmentsApi = {
  create: (data: EnrollmentCreateRequest) => 
    api.post<any, EnrollmentResponse>('/enrollments', data),
    
  getByClassId: (classId: number) => 
    api.get<any, EnrollmentResponse[]>(`/enrollments/class/${classId}`),
    
  getByStudentId: (studentId: number) => 
    api.get<any, EnrollmentResponse[]>(`/enrollments/student/${studentId}`)
};
