import api from '../../lib/api';
import type { 
  AttendanceResponse, 
  AttendanceCreateRequest, 
  AttendanceBatchRequest 
} from '../../types/yoedu';

export const attendanceApi = {
  create: (data: AttendanceCreateRequest) => 
    api.post<any, AttendanceResponse>('/attendances', data),
    
  createBatch: (data: AttendanceBatchRequest) => 
    api.post<any, AttendanceResponse[]>('/attendances/batch', data),
    
  getByClassAndDate: (classId: number, attendanceDate?: string) => 
    api.get<any, AttendanceResponse[]>(`/attendances/class/${classId}`, { 
      params: { attendanceDate: attendanceDate || undefined } 
    }),
    
  getMatrixByClassId: (classId: number) => 
    api.get<any, any>(`/attendances/matrix/${classId}`)
};
