import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { courseClassesApi } from '../course-classes.api';
import { coursesApi } from '../../courses/courses.api';
import { referenceApi } from '../../reference/reference.api';
import type { CourseClassResponse } from '../../../types/yoedu';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import type { Column } from '../../../components/ui/DataTable';
import { ClassForm } from '../components/CourseClassForm';
import { CourseClassDetail } from '../components/CourseClassDetail';
import toast from 'react-hot-toast';

export const CourseClassesList: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const [selectedClass, setSelectedClass] = useState<CourseClassResponse | undefined>(undefined);

  const { data: classes, isLoading, isError } = useQuery({
    queryKey: ['course-classes', debouncedSearch],
    queryFn: () => courseClassesApi.getAll(debouncedSearch),
  });

  const { data: courses } = useQuery({ queryKey: ['courses'], queryFn: () => coursesApi.getAll('') });
  const { data: teachers } = useQuery({ queryKey: ['ref-teachers'], queryFn: referenceApi.getTeachers });
  const { data: rooms } = useQuery({ queryKey: ['ref-rooms'], queryFn: referenceApi.getRooms });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => courseClassesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-classes'] });
      toast.success('Class deleted successfully');
      setIsConfirmDeleteOpen(false);
      setSelectedClass(undefined);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete class');
      setIsConfirmDeleteOpen(false);
    }
  });

  const columns: Column<CourseClassResponse>[] = [
    { key: 'classCode', label: 'Class Code' },
    { 
      key: 'courseId', 
      label: 'Course',
      render: (c: any) => courses?.find(course => course.id === c.courseId)?.name || `ID: ${c.courseId}`
    },
    { 
      key: 'teacherId', 
      label: 'Teacher',
      render: (c: any) => c.teacherId ? (teachers?.find(t => t.id === c.teacherId)?.fullName || 'N/A') : 'N/A'
    },
    { 
      key: 'roomId', 
      label: 'Room',
      render: (c: any) => c.roomId ? (rooms?.find(r => r.id === c.roomId)?.name || 'N/A') : 'N/A'
    },
    { 
      key: 'students', 
      label: 'Students',
      render: (c: any) => `${c.currentStudents}/${c.maxStudents}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (c: any) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          c.status === 'OPEN' ? 'bg-green-50 text-green-700 ring-green-600/20' :
          c.status === 'ONGOING' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
          c.status === 'FULL' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
          'bg-gray-50 text-gray-600 ring-gray-500/10'
        }`}>
          {c.status}
        </span>
      )
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Course Classes" 
        onAdd={() => { setSelectedClass(undefined); setIsFormOpen(true); }}
        addLabel="Add Class"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search classes by code..."
      />

      <DataTable
        data={classes}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        keyExtractor={(item: any) => item.id}
        onView={(item: any) => { setSelectedClass(item); setIsDetailOpen(true); }}
        onEdit={(item: any) => { setSelectedClass(item); setIsFormOpen(true); }}
        onDelete={(item: any) => { setSelectedClass(item); setIsConfirmDeleteOpen(true); }}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedClass ? 'Edit Class' : 'Add New Class'}
        maxWidth="max-w-3xl"
      >
        <ClassForm
          initialData={selectedClass}
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Class Details"
      >
        {selectedClass && <CourseClassDetail courseClass={selectedClass} />}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => selectedClass && deleteMutation.mutate(selectedClass.id)}
        title="Delete Class"
        message={`Are you sure you want to delete ${selectedClass?.classCode}?`}
        isProcessing={deleteMutation.isPending}
      />
    </div>
  );
};
