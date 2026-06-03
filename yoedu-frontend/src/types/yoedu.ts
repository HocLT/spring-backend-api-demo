// Enums as string literal unions
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type StudentStatus = 'ACTIVE' | 'PAUSED' | 'DROPPED';
export type TeacherRole = 'TEACHER' | 'ASSISTANT' | 'BOTH';
export type ClassStatus = 'OPEN' | 'ONGOING' | 'CLOSED' | 'FULL';
export type EnrollmentStatus = 'ACTIVE' | 'PAUSED' | 'DROPPED' | 'COMPLETED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER';
export type DiscountType = 'PERCENTAGE' | 'FIXED' | 'PERCENT' | 'AMOUNT';
export type InvoiceStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERPAID';
export type LeaveRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Base entity for common fields
export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

// Student DTOs
export interface StudentResponse extends BaseEntity {
  studentCode: string;
  fullName: string;
  dob: string;
  gender: Gender;
  address?: string;
  status: StudentStatus;
  parentId?: number;
}

export interface StudentUpsertRequest {
  fullName: string;
  dob: string;
  gender: Gender;
  address?: string;
  status?: StudentStatus;
  parentId?: number;
}

export interface StudentWithParentUpsertRequest extends StudentUpsertRequest {
  parentFullName: string;
  parentPhone: string;
  parentEmail?: string;
}

// Teacher DTOs
export interface TeacherResponse extends BaseEntity {
  teacherCode: string;
  fullName: string;
  email: string;
  phone: string;
  teacherRole: TeacherRole;
}

export interface TeacherUpsertRequest {
  fullName: string;
  email: string;
  phone: string;
  teacherRole: TeacherRole;
}

// Course DTOs
export interface CourseResponse extends BaseEntity {
  courseCode: string;
  name: string;
  description?: string;
  tuitionFee: number;
  durationMonths?: number;
  isActive: boolean;
}

export interface CourseUpsertRequest {
  courseCode: string;
  name: string;
  description?: string;
  tuitionFee: number;
  durationMonths?: number;
  isActive?: boolean;
}

// CourseClass DTOs
export interface CourseClassResponse extends BaseEntity {
  classCode: string;
  courseId: number;
  teacherId?: number;
  roomId?: number;
  startDate: string;
  endDate?: string;
  status: ClassStatus;
  maxStudents: number;
  currentStudents: number;
}

export interface CourseClassCreateRequest {
  classCode: string;
  courseId: number;
  teacherId?: number;
  roomId?: number;
  startDate: string;
  endDate?: string;
  status?: ClassStatus;
  maxStudents: number;
}

// Enrollment DTOs
export interface EnrollmentResponse extends BaseEntity {
  studentId: number;
  classId: number;
  enrollmentDate: string;
  status: EnrollmentStatus;
}

export interface EnrollmentCreateRequest {
  studentId: number;
  classId: number;
  status?: EnrollmentStatus;
}

// Attendance DTOs
export interface AttendanceResponse extends BaseEntity {
  studentId: number;
  classId: number;
  scheduleSlotId: number;
  attendanceDate: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceCreateRequest {
  studentId: number;
  classId: number;
  scheduleSlotId: number;
  attendanceDate: string;
  status: AttendanceStatus;
  note?: string;
}

export interface StudentAttendanceRowDto {
  studentId: number;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceBatchRequest {
  classId: number;
  scheduleSlotId: number;
  attendanceDate: string;
  records: StudentAttendanceRowDto[];
}

// Invoice & Payment DTOs
export interface InvoiceResponse extends BaseEntity {
  invoiceNo: string;
  studentId: number;
  amountDue: number;
  amountPaid: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export interface InvoiceCreateRequest {
  studentId: number;
  classId: number;
  promotionId?: number;
  billingMonth: string;
  dueDate?: string;
  amountDue?: number;
  description?: string;
}

export interface PaymentResponse extends BaseEntity {
  invoiceId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNote?: string;
}

export interface PaymentCreateRequest {
  invoiceId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paidAt: string;
  referenceNote?: string;
}

// Promotion DTOs
export interface PromotionResponse extends BaseEntity {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PromotionUpsertRequest {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

// Room DTOs
export interface RoomResponse extends BaseEntity {
  name: string;
  capacity: number;
  location?: string;
}

export interface RoomUpsertRequest {
  name: string;
  capacity: number;
  location?: string;
}

// Schedule Slot DTOs
export interface ScheduleSlotResponse extends BaseEntity {
  classId: number;
  roomId: number;
  teacherId: number;
  dayOfWeek: number; // 1-7
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface ScheduleSlotUpsertRequest {
  classId: number;
  roomId: number;
  teacherId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// Learning Result DTOs
export interface LearningResultResponse extends BaseEntity {
  studentId: number;
  classId: number;
  score: number;
  remarks?: string;
  recordedDate: string;
}

export interface LearningResultCreateRequest {
  studentId: number;
  classId: number;
  score: number;
  remarks?: string;
}

// Leave Request DTOs
export interface LeaveRequestResponse extends BaseEntity {
  studentId: number;
  classId: number;
  requestDate: string;
  reason: string;
  status: LeaveRequestStatus;
}

export interface LeaveRequestCreateRequest {
  studentId: number;
  classId: number;
  requestDate: string;
  reason: string;
}

// Dashboard DTOs
export interface MonthlyRevenueDto {
  month: number;
  year: number;
  totalRevenue: number;
}

export interface CourseRevenueDto {
  courseId: number;
  courseName: string;
  revenue: number;
}

export interface DashboardStatsResponse {
  totalStudents: number;
  totalTeachers: number;
  activeClasses: number;
  totalRevenue: number;
  monthlyRevenue: MonthlyRevenueDto[];
  revenueByCourse: CourseRevenueDto[];
}

export interface ParentDashboardResponse {
  parentId: number;
  children: {
    student: StudentResponse;
    enrollments: EnrollmentResponse[];
    recentAttendance: AttendanceResponse[];
    unpaidInvoices: InvoiceResponse[];
    learningResults: LearningResultResponse[];
  }[];
}
