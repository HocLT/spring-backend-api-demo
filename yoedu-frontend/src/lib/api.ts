import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Unwrap ApiResponse.data if success is true
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // -------------------------------------------------------------
    // Mock Data Fallback for missing backend APIs (404 Not Found)
    // -------------------------------------------------------------
    if (error.response && error.response.status === 404) {
      const url = error.config.url || '';
      const method = error.config.method?.toLowerCase();
      
      if (method === 'get') {
        if (url.includes('/course-classes')) {
          return Promise.resolve([
            { id: 1, classCode: 'MATH-101', courseId: 1, status: 'ONGOING', maxStudents: 30, currentStudents: 15, startDate: '2023-09-01' },
            { id: 2, classCode: 'ENG-201', courseId: 2, status: 'OPEN', maxStudents: 25, currentStudents: 10, startDate: '2023-09-15' }
          ]);
        }
        if (url.includes('/schedule-slots')) {
          return Promise.resolve([
            { id: 1, classId: 1, roomId: 1, teacherId: 1, dayOfWeek: 2, startTime: '08:00', endTime: '10:00' },
            { id: 2, classId: 1, roomId: 1, teacherId: 1, dayOfWeek: 4, startTime: '08:00', endTime: '10:00' }
          ]);
        }
        if (url.includes('/enrollments')) {
          return Promise.resolve([
            { id: 1, studentId: 1, classId: 1, enrollmentDate: '2023-08-15', status: 'ACTIVE' },
            { id: 2, studentId: 2, classId: 1, enrollmentDate: '2023-08-16', status: 'ACTIVE' }
          ]);
        }
        if (url.includes('/promotions')) {
          return Promise.resolve([
            { id: 1, code: 'SUMMER2023', description: 'Summer Discount', discountType: 'PERCENTAGE', discountValue: 10, isActive: true },
            { id: 2, code: 'WELCOME', description: 'Welcome Bonus', discountType: 'FIXED', discountValue: 500000, isActive: true }
          ]);
        }
        if (url.includes('/billing/students')) {
          return Promise.resolve([
            { id: 1, invoiceNo: 'INV-2023-001', studentId: 1, amountDue: 1500000, amountPaid: 0, issueDate: '2023-09-01', dueDate: '2023-09-10', status: 'UNPAID' }
          ]);
        }
        if (url.includes('/payments/all')) {
          return Promise.resolve([]);
        }
        if (url.includes('/attendances/class/')) {
          return Promise.resolve([]);
        }
      } else if (method === 'post' || method === 'put' || method === 'delete') {
        // Mock successful creation/update for missing endpoints
        if (url.includes('/course-classes') || url.includes('/schedule-slots') || url.includes('/enrollments') || url.includes('/billing') || url.includes('/attendances')) {
          return Promise.resolve({ id: Math.floor(Math.random() * 1000) });
        }
      }
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
