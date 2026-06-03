import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { teachersApi } from '../teachers.api';
import type { TeacherResponse } from '../../../types/yoedu';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import type { Column } from '../../../components/ui/DataTable';
import { TeacherForm } from '../components/TeacherForm';
import { TeacherDetail } from '../components/TeacherDetail';
import toast from 'react-hot-toast';

export const TeachersList: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherResponse | undefined>(undefined);

  const { data: teachers, isLoading, isError } = useQuery({
    queryKey: ['teachers', debouncedSearch],
    queryFn: () => teachersApi.getAll(debouncedSearch),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => teachersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Teacher deleted successfully');
      setIsConfirmDeleteOpen(false);
      setSelectedTeacher(undefined);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete teacher');
      setIsConfirmDeleteOpen(false);
    }
  });

  const columns: Column<TeacherResponse>[] = [
    { key: 'teacherCode', label: 'Code' },
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'teacherRole', 
      label: 'Role',
      render: (t: any) => (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
          {t.teacherRole}
        </span>
      )
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Teachers" 
        onAdd={() => { setSelectedTeacher(undefined); setIsFormOpen(true); }}
        addLabel="Add Teacher"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search teachers by name or code..."
      />

      <DataTable
        data={teachers}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        keyExtractor={(item: any) => item.id}
        onView={(item: any) => { setSelectedTeacher(item); setIsDetailOpen(true); }}
        onEdit={(item: any) => { setSelectedTeacher(item); setIsFormOpen(true); }}
        onDelete={(item: any) => { setSelectedTeacher(item); setIsConfirmDeleteOpen(true); }}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedTeacher ? 'Edit Teacher' : 'Add New Teacher'}
      >
        <TeacherForm
          initialData={selectedTeacher}
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Teacher Details"
      >
        {selectedTeacher && <TeacherDetail teacher={selectedTeacher} />}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => selectedTeacher && deleteMutation.mutate(selectedTeacher.id)}
        title="Delete Teacher"
        message={`Are you sure you want to delete ${selectedTeacher?.fullName}?`}
        isProcessing={deleteMutation.isPending}
      />
    </div>
  );
};
