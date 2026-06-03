import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { coursesApi } from '../courses.api';
import type { CourseResponse } from '../../../types/yoedu';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import type { Column } from '../../../components/ui/DataTable';
import { CourseForm } from '../components/CourseForm';
import { CourseDetail } from '../components/CourseDetail';
import toast from 'react-hot-toast';
import { formatVND } from '../../../utils/format';

export const CoursesList: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | undefined>(undefined);

  const { data: courses, isLoading, isError } = useQuery({
    queryKey: ['courses', debouncedSearch],
    queryFn: () => coursesApi.getAll(debouncedSearch),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => coursesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully');
      setIsConfirmDeleteOpen(false);
      setSelectedCourse(undefined);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete course');
      setIsConfirmDeleteOpen(false);
    }
  });

  const columns: Column<CourseResponse>[] = [
    { key: 'courseCode', label: 'Course Code' },
    { key: 'name', label: 'Course Name' },
    { 
      key: 'tuitionFee', 
      label: 'Tuition Fee',
      render: (c: any) => formatVND(c.tuitionFee)
    },
    { key: 'durationMonths', label: 'Duration (m)' },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (c: any) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          c.isActive ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10'
        }`}>
          {c.isActive ? 'ACTIVE' : 'INACTIVE'}
        </span>
      )
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Courses" 
        onAdd={() => { setSelectedCourse(undefined); setIsFormOpen(true); }}
        addLabel="Add Course"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search courses by code or name..."
      />

      <DataTable
        data={courses}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        keyExtractor={(item: any) => item.id}
        onView={(item: any) => { setSelectedCourse(item); setIsDetailOpen(true); }}
        onEdit={(item: any) => { setSelectedCourse(item); setIsFormOpen(true); }}
        onDelete={(item: any) => { setSelectedCourse(item); setIsConfirmDeleteOpen(true); }}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedCourse ? 'Edit Course' : 'Add New Course'}
      >
        <CourseForm
          initialData={selectedCourse}
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Course Details"
      >
        {selectedCourse && <CourseDetail course={selectedCourse} />}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => selectedCourse && deleteMutation.mutate(selectedCourse.id)}
        title="Delete Course"
        message={`Are you sure you want to delete ${selectedCourse?.name}?`}
        isProcessing={deleteMutation.isPending}
      />
    </div>
  );
};
