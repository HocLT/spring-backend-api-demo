import api from '../../lib/api';
import type { CourseResponse, CourseUpsertRequest } from '../../types/yoedu';

export const coursesApi = {
  getAll: (keyword?: string) => 
    api.get<any, CourseResponse[]>('/courses', { params: { keyword: keyword || undefined } }),
    
  getById: (id: number) => 
    api.get<any, CourseResponse>(`/courses/${id}`),
    
  create: (data: CourseUpsertRequest) => 
    api.post<any, CourseResponse>('/courses', data),
    
  update: (id: number, data: CourseUpsertRequest) => 
    api.put<any, CourseResponse>(`/courses/${id}`, data),
    
  delete: (id: number) => 
    api.delete<any, void>(`/courses/${id}`)
};
