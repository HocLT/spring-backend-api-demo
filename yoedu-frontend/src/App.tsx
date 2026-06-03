import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import PlaceholderPage from './pages/PlaceholderPage';
import { StudentsList } from './features/students/pages/StudentsList';
import { TeachersList } from './features/teachers/pages/TeachersList';
import { CoursesList } from './features/courses/pages/CoursesList';
import { RoomsList } from './features/rooms/pages/RoomsList';
import { ScheduleSlotsList } from './features/schedule-slots/pages/ScheduleSlotsList';
import { PromotionsList } from './features/promotions/pages/PromotionsList';
import { CourseClassesList } from './features/course-classes/pages/CourseClassesList';
import { EnrollmentsList } from './features/enrollments/pages/EnrollmentsList';
import { AttendancePage } from './features/attendance/pages/AttendancePage';
import { BillingPage } from './features/billing/pages/BillingPage';
import { PaymentsPage } from './features/billing/pages/PaymentsPage';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<PlaceholderPage title="Dashboard Overview" />} />
              <Route path="students" element={<StudentsList />} />
              <Route path="teachers" element={<TeachersList />} />
              <Route path="courses" element={<CoursesList />} />
              <Route path="classes" element={<CourseClassesList />} />
              <Route path="enrollments" element={<EnrollmentsList />} />
              <Route path="rooms" element={<RoomsList />} />
              <Route path="schedule-slots" element={<ScheduleSlotsList />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="promotions" element={<PromotionsList />} />
              <Route path="rooms" element={<PlaceholderPage title="Room Management" />} />
              <Route path="schedule-slots" element={<PlaceholderPage title="Schedule Slots" />} />
              <Route path="reports" element={<PlaceholderPage title="Reports" />} />
              <Route path="parent" element={<PlaceholderPage title="Parent Portal" />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
