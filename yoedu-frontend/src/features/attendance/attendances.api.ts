import api from '../../lib/api';
import type { AttendanceResponse, AttendanceBatchRequest } from '../../types/yoedu';

export interface AttendanceMatrixResponse {
  dates: string[];
  students: {
    studentId: number;
    studentName: string;
    studentCode: string;
    attendances: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>;
  }[];
}

export const attendancesApi = {
  submitBatch: (data: AttendanceBatchRequest) => 
    api.post<any, void>('/attendances/batch', data),
    
  getMatrixByClass: (classId: number) => 
    api.get<any, AttendanceMatrixResponse>(`/attendances/matrix/${classId}`),
    
  getByClassAndDate: (classId: number, date: string) => 
    api.get<any, AttendanceResponse[]>(`/attendances/class/${classId}`, { params: { attendanceDate: date } })
};
