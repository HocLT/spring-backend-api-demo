import api from '../../lib/api';
import type { AuthResponse, CurrentUser } from '../../types/api';

export const authApi = {
  login: async (credentials: any): Promise<AuthResponse> => {
    return api.post<any, AuthResponse>('/auth/login', credentials);
  },
  
  me: async (): Promise<CurrentUser> => {
    return api.get<any, CurrentUser>('/auth/me');
  }
};
