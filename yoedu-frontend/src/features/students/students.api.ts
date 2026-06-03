import api from '../../lib/api';
import type { 
  StudentResponse, 
  StudentUpsertRequest, 
  StudentWithParentUpsertRequest 
} from '../../types/yoedu';

export const studentsApi = {
  getAll: (keyword?: string) => 
    api.get<any, StudentResponse[]>('/students', { params: { keyword: keyword || undefined } }),
    
  getById: (id: number) => 
    api.get<any, StudentResponse>(`/students/${id}`),
    
  create: (data: StudentUpsertRequest) => 
    api.post<any, StudentResponse>('/students', data),
    
  createWithParent: (data: StudentWithParentUpsertRequest) => 
    api.post<any, StudentResponse>('/students/with-parent', data),
    
  update: (id: number, data: StudentUpsertRequest) => 
    api.put<any, StudentResponse>(`/students/${id}`, data),
    
  updateWithParent: (id: number, data: StudentWithParentUpsertRequest) => 
    api.put<any, StudentResponse>(`/students/${id}/with-parent`, data),
    
  delete: (id: number) => 
    api.delete<any, void>(`/students/${id}`)
};
