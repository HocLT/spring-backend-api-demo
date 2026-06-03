import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendancesApi } from '../attendances.api';
import { enrollmentsApi } from '../../enrollments/enrollments.api';
import { studentsApi } from '../../students/students.api';
import { scheduleSlotsApi } from '../../schedule-slots/schedule-slots.api';
import type { AttendanceBatchRequest, StudentAttendanceRowDto, AttendanceStatus } from '../../../types/yoedu';
import toast from 'react-hot-toast';

export const TakeAttendanceTab: React.FC<{ selectedClassId: number }> = ({ selectedClassId }) => {
  const queryClient = useQueryClient();
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleSlotId, setScheduleSlotId] = useState<number | ''>('');
  
  // State to hold local attendance modifications before submitting
  const [attendanceRecords, setAttendanceRecords] = useState<Record<number, StudentAttendanceRowDto>>({});

  const { data: enrollments } = useQuery({
    queryKey: ['enrollments', 'class', selectedClassId],
    queryFn: () => enrollmentsApi.getByClassId(selectedClassId),
    enabled: !!selectedClassId,
  });

  const { data: students } = useQuery({ 
    queryKey: ['students', ''], 
    queryFn: () => studentsApi.getAll('') 
  });

  const { data: scheduleSlots } = useQuery({
    queryKey: ['schedule-slots', ''],
    queryFn: () => scheduleSlotsApi.getAll(''),
  });
  
  const classSlots = scheduleSlots?.filter((s: any) => s.classId === selectedClassId) || [];

  const { data: existingAttendances, isLoading: isLoadingExisting } = useQuery({
    queryKey: ['attendances', selectedClassId, attendanceDate],
    queryFn: () => attendancesApi.getByClassAndDate(selectedClassId, attendanceDate),
    enabled: !!selectedClassId && !!attendanceDate,
  });

  // Initialize records when students or existing attendances change
  useEffect(() => {
    if (enrollments && students) {
      const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE' || e.status === 'PAUSED');
      
      const newRecords: Record<number, StudentAttendanceRowDto> = {};
      
      activeEnrollments.forEach(en => {
        const existing = existingAttendances?.find(a => a.studentId === en.studentId);
        newRecords[en.studentId] = {
          studentId: en.studentId,
          status: existing ? existing.status : 'PRESENT', // default PRESENT
          note: existing?.note || ''
        };
      });
      
      setAttendanceRecords(newRecords);
    }
  }, [enrollments, students, existingAttendances]);

  const updateRecord = (studentId: number, field: keyof StudentAttendanceRowDto, value: any) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const submitMutation = useMutation({
    mutationFn: (data: AttendanceBatchRequest) => attendancesApi.submitBatch(data),
    onSuccess: () => {
      toast.success('Attendance saved successfully');
      queryClient.invalidateQueries({ queryKey: ['attendances', selectedClassId] });
      queryClient.invalidateQueries({ queryKey: ['attendances-matrix', selectedClassId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save attendance');
    }
  });

  const handleSave = () => {
    if (!selectedClassId) return toast.error('Class is required');
    if (!attendanceDate) return toast.error('Date is required');
    if (!scheduleSlotId && classSlots.length > 0) return toast.error('Schedule slot is required');
    
    // If no slots exist, backend might tolerate 0 or we use 0. Ideally, slots should exist.
    const finalSlotId = scheduleSlotId || (classSlots.length > 0 ? classSlots[0].id : 0);

    const records = Object.values(attendanceRecords);
    if (records.length === 0) return toast.error('No students to mark');

    submitMutation.mutate({
      classId: selectedClassId,
      attendanceDate,
      scheduleSlotId: Number(finalSlotId),
      records
    });
  };

  if (!selectedClassId) {
    return <div className="p-8 text-center text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg">Please select a class first.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Date</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={e => setAttendanceDate(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Slot</label>
          <select
            value={scheduleSlotId}
            onChange={e => setScheduleSlotId(e.target.value ? Number(e.target.value) : '')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
          >
            <option value="">-- Select Slot --</option>
            {classSlots.map((s: any) => (
              <option key={s.id} value={s.id}>
                Day {s.dayOfWeek}: {s.startTime} - {s.endTime}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleSave}
            disabled={submitMutation.isPending || isLoadingExisting}
            className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
          >
            {submitMutation.isPending ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrollments?.filter(e => e.status === 'ACTIVE' || e.status === 'PAUSED').map(en => {
              const student = students?.find(s => s.id === en.studentId);
              const record = attendanceRecords[en.studentId];
              if (!record) return null;

              return (
                <tr key={en.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{student?.fullName}</div>
                    <div className="text-gray-500 text-xs">{student?.studentCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={record.status}
                      onChange={(e) => updateRecord(en.studentId, 'status', e.target.value as AttendanceStatus)}
                      className={`block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 border font-semibold ${
                        record.status === 'PRESENT' ? 'bg-green-50 text-green-700 border-green-200 focus:border-green-500 focus:ring-green-500' :
                        record.status === 'ABSENT' ? 'bg-red-50 text-red-700 border-red-200 focus:border-red-500 focus:ring-red-500' :
                        record.status === 'LATE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500' :
                        'bg-gray-50 text-gray-700 border-gray-200 focus:border-gray-500 focus:ring-gray-500'
                      }`}
                    >
                      <option value="PRESENT">PRESENT</option>
                      <option value="ABSENT">ABSENT</option>
                      <option value="LATE">LATE</option>
                      <option value="EXCUSED">EXCUSED</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      placeholder="Optional note..."
                      value={record.note || ''}
                      onChange={(e) => updateRecord(en.studentId, 'note', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
                    />
                  </td>
                </tr>
              );
            })}
            {(!enrollments || enrollments.filter(e => e.status === 'ACTIVE' || e.status === 'PAUSED').length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No active students enrolled in this class.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
