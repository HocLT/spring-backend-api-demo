export type UserRole = 'ADMIN' | 'ACADEMIC_STAFF' | 'CASHIER' | 'PARENT' | 'TEACHER';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: CurrentUser;
}
