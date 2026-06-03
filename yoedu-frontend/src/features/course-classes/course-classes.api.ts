import api from '../../lib/api';
import type { CourseClassResponse, CourseClassCreateRequest } from '../../types/yoedu';

export const courseClassesApi = {
  getAll: (keyword?: string) => 
    api.get<any, CourseClassResponse[]>('/course-classes', { params: { keyword: keyword || undefined } }),
    
  getById: (id: number) => 
    api.get<any, CourseClassResponse>(`/course-classes/${id}`),
    
  getByCourseId: (courseId: number) => 
    api.get<any, CourseClassResponse[]>(`/course-classes/course/${courseId}`),
    
  create: (data: CourseClassCreateRequest) => 
    api.post<any, CourseClassResponse>('/course-classes', data),
    
  update: (id: number, data: CourseClassCreateRequest) => 
    api.put<any, CourseClassResponse>(`/course-classes/${id}`, data),
    
  delete: (id: number) => 
    api.delete<any, void>(`/course-classes/${id}`)
};
