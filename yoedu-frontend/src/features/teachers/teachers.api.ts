import api from '../../lib/api';
import type { TeacherResponse, TeacherUpsertRequest } from '../../types/yoedu';

export const teachersApi = {
  getAll: (keyword?: string) => 
    api.get<any, TeacherResponse[]>('/teachers', { params: { keyword: keyword || undefined } }),
    
  getById: (id: number) => 
    api.get<any, TeacherResponse>(`/teachers/${id}`),
    
  create: (data: TeacherUpsertRequest) => 
    api.post<any, TeacherResponse>('/teachers', data),
    
  update: (id: number, data: TeacherUpsertRequest) => 
    api.put<any, TeacherResponse>(`/teachers/${id}`, data),
    
  delete: (id: number) => 
    api.delete<any, void>(`/teachers/${id}`)
};
