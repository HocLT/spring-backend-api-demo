import api from '../../lib/api';
import type { DashboardStatsResponse, MonthlyRevenueDto, CourseRevenueDto } from '../../types/yoedu';

export const reportsApi = {
  getDashboardStats: () => 
    api.get<any, DashboardStatsResponse>('/reports/dashboard-stats'),
    
  getMonthlyRevenue: (year?: number) => 
    api.get<any, MonthlyRevenueDto[]>('/reports/revenue/monthly', { 
      params: { year: year || undefined } 
    }),
    
  getCourseRevenue: (year?: number, month?: number) => 
    api.get<any, CourseRevenueDto[]>('/reports/revenue/course', { 
      params: { year: year || undefined, month: month || undefined } 
    })
};
