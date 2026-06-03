import api from '../../lib/api';
import type { ParentDashboardResponse } from '../../types/yoedu';

export const parentsApi = {
  getDashboard: () => 
    api.get<any, ParentDashboardResponse>('/parent/dashboard')
};
