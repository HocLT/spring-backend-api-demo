import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { enrollmentsApi } from '../enrollments.api';
import { courseClassesApi } from '../../course-classes/course-classes.api';
import { studentsApi } from '../../students/students.api';
import type { EnrollmentResponse } from '../../../types/yoedu';
import { Modal } from '../../../components/ui/Modal';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import type { Column } from '../../../components/ui/DataTable';
import { EnrollmentForm } from '../components/EnrollmentForm';
import { formatDate } from '../../../utils/format';

export const EnrollmentsList: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: classes } = useQuery({ 
    queryKey: ['course-classes', ''], 
    queryFn: () => courseClassesApi.getAll('') 
  });
  
  const { data: students } = useQuery({ 
    queryKey: ['students', ''], 
    queryFn: () => studentsApi.getAll('') 
  });

  const { data: enrollments, isLoading, isError } = useQuery({
    queryKey: ['enrollments', 'class', selectedClassId],
    queryFn: () => enrollmentsApi.getByClassId(selectedClassId as number),
    enabled: !!selectedClassId,
  });

  const columns: Column<EnrollmentResponse>[] = [
    { 
      key: 'studentId', 
      label: 'Student',
      render: (e: any) => {
        const student = students?.find(s => s.id === e.studentId);
        return student ? `${student.studentCode} - ${student.fullName}` : `ID: ${e.studentId}`;
      }
    },
    { 
      key: 'enrollmentDate', 
      label: 'Enrolled At',
      render: (e: any) => formatDate(e.enrollmentDate)
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (e: any) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          e.status === 'ACTIVE' ? 'bg-green-50 text-green-700 ring-green-600/20' :
          e.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
          e.status === 'PAUSED' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
          'bg-red-50 text-red-700 ring-red-600/10'
        }`}>
          {e.status}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Enrollments" 
        onAdd={() => setIsFormOpen(true)}
        addLabel="Enroll Student"
      />

      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select a Class to view enrollments:</label>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : '')}
          className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
        >
          <option value="">-- Choose a Class --</option>
          {classes?.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.classCode} ({c.currentStudents}/{c.maxStudents} students)
            </option>
          ))}
        </select>
      </div>

      {!selectedClassId ? (
        <div className="p-12 text-center text-gray-500 bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">
          Please select a class to view its enrollments.
        </div>
      ) : (
        <DataTable
          data={enrollments}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          keyExtractor={(item: any) => item.id}
        />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Enroll Student"
      >
        <EnrollmentForm
          preSelectedClassId={selectedClassId ? Number(selectedClassId) : undefined}
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
};
