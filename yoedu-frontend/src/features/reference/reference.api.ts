import api from '../../lib/api';
import type { TeacherResponse, RoomResponse, ScheduleSlotResponse, PromotionResponse } from '../../types/yoedu';

export const referenceApi = {
  getTeachers: () => 
    api.get<any, TeacherResponse[]>('/teachers'),
    
  getRooms: () => 
    api.get<any, RoomResponse[]>('/rooms'),
    
  getScheduleSlots: () => 
    api.get<any, ScheduleSlotResponse[]>('/schedule-slots'),
    
  getPromotions: () => 
    api.get<any, PromotionResponse[]>('/promotions')
};
