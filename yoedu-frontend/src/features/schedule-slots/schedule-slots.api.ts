import api from '../../lib/api';
import type { ScheduleSlotResponse, ScheduleSlotUpsertRequest } from '../../types/yoedu';

export const scheduleSlotsApi = {
  getAll: (keyword?: string) => 
    api.get<any, ScheduleSlotResponse[]>('/schedule-slots', { params: { keyword: keyword || undefined } }),
    
  getById: (id: number) => 
    api.get<any, ScheduleSlotResponse>(`/schedule-slots/${id}`),
    
  create: (data: ScheduleSlotUpsertRequest) => 
    api.post<any, ScheduleSlotResponse>('/schedule-slots', data),
    
  update: (id: number, data: ScheduleSlotUpsertRequest) => 
    api.put<any, ScheduleSlotResponse>(`/schedule-slots/${id}`, data),
    
  delete: (id: number) => 
    api.delete<any, void>(`/schedule-slots/${id}`)
};
