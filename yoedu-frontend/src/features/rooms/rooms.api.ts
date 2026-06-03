import api from '../../lib/api';
import type { RoomResponse, RoomUpsertRequest } from '../../types/yoedu';

export const roomsApi = {
  getAll: (keyword?: string) => 
    api.get<any, RoomResponse[]>('/rooms', { params: { keyword: keyword || undefined } }),
    
  getById: (id: number) => 
    api.get<any, RoomResponse>(`/rooms/${id}`),
    
  create: (data: RoomUpsertRequest) => 
    api.post<any, RoomResponse>('/rooms', data),
    
  update: (id: number, data: RoomUpsertRequest) => 
    api.put<any, RoomResponse>(`/rooms/${id}`, data),
    
  delete: (id: number) => 
    api.delete<any, void>(`/rooms/${id}`)
};
