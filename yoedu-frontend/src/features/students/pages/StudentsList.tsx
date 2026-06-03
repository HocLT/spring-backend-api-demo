import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { studentsApi } from '../students.api';
import type { StudentResponse } from '../../../types/yoedu';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { StudentForm } from '../components/StudentForm';
import { StudentDetail } from '../components/StudentDetail';
import toast from 'react-hot-toast';

export const StudentsList: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | undefined>(undefined);

  const { data: students, isLoading, isError } = useQuery({
    queryKey: ['students', debouncedSearch],
    queryFn: () => studentsApi.getAll(debouncedSearch),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => studentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully');
      setIsConfirmDeleteOpen(false);
      setSelectedStudent(undefined);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete student');
      setIsConfirmDeleteOpen(false);
    }
  });

  const handleCreate = () => {
    setSelectedStudent(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleView = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStudent) {
      deleteMutation.mutate(selectedStudent.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Students</h2>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Student
        </button>
      </div>

      <div className="flex items-center px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
        <Search className="h-5 w-5 text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Search students by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
        />
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading students...</div>
        ) : isError ? (
          <div className="p-12 text-center text-red-500">Error loading students. Please try again.</div>
        ) : !students || students.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No students found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Code</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Gender</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {student.studentCode}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{student.fullName}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{student.gender}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      student.status === 'ACTIVE' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                      student.status === 'PAUSED' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                      'bg-red-50 text-red-700 ring-red-600/10'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end space-x-3">
                      <button onClick={() => handleView(student)} className="text-gray-500 hover:text-gray-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-900">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(student)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedStudent ? 'Edit Student' : 'Add New Student'}
        maxWidth="max-w-2xl"
      >
        <StudentForm
          initialData={selectedStudent}
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Student Details"
        maxWidth="max-w-xl"
      >
        {selectedStudent && <StudentDetail student={selectedStudent} />}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.fullName}? This action cannot be undone.`}
        isProcessing={deleteMutation.isPending}
      />
    </div>
  );
};
