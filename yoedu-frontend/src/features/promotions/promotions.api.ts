import api from '../../lib/api';
import type { PromotionResponse, PromotionUpsertRequest } from '../../types/yoedu';

export const promotionsApi = {
  getAll: (keyword?: string) => 
    api.get<any, PromotionResponse[]>('/promotions', { params: { keyword: keyword || undefined } }),
    
  getById: (id: number) => 
    api.get<any, PromotionResponse>(`/promotions/${id}`),
    
  create: (data: PromotionUpsertRequest) => 
    api.post<any, PromotionResponse>('/promotions', data),
    
  update: (id: number, data: PromotionUpsertRequest) => 
    api.put<any, PromotionResponse>(`/promotions/${id}`, data),
    
  delete: (id: number) => 
    api.delete<any, void>(`/promotions/${id}`)
};
