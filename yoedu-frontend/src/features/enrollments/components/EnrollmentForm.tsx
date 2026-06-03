import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { enrollmentsApi } from '../enrollments.api';
import { studentsApi } from '../../students/students.api';
import { courseClassesApi } from '../../course-classes/course-classes.api';
import type { EnrollmentResponse } from '../../../types/yoedu';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { FormField, Select } from '../../../components/ui/FormField';

const enrollmentSchema = z.object({
  studentId: z.coerce.number().min(1, 'Student is required'),
  classId: z.coerce.number().min(1, 'Class is required'),
  status: z.enum(['ACTIVE', 'PAUSED', 'DROPPED', 'COMPLETED']).optional(),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  initialData?: EnrollmentResponse;
  preSelectedClassId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ initialData, preSelectedClassId, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentId: initialData?.studentId || 0,
      classId: initialData?.classId || preSelectedClassId || 0,
      status: initialData?.status || 'ACTIVE',
    }
  });

  const { data: students } = useQuery({ queryKey: ['students', ''], queryFn: () => studentsApi.getAll('') });
  const { data: classes } = useQuery({ queryKey: ['course-classes', ''], queryFn: () => courseClassesApi.getAll('') });

  const mutation = useMutation({
    mutationFn: async (data: EnrollmentFormValues) => {
      // API only supports create based on provided endpoints
      if (isEditing) {
        // Fallback to create if update is not explicitly supported or modify API if needed
        toast.error('Update enrollment is not supported by API yet.');
        throw new Error('Update not supported');
      } else {
        return enrollmentsApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      toast.success(`Enrollment created successfully`);
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Student" error={errors.studentId?.message as string} required>
        <Select {...register('studentId')} disabled={isEditing}>
          <option value={0}>Select a student...</option>
          {students?.map(s => <option key={s.id} value={s.id}>{s.studentCode} - {s.fullName}</option>)}
        </Select>
      </FormField>

      <FormField label="Class" error={errors.classId?.message as string} required>
        <Select {...register('classId')} disabled={isEditing}>
          <option value={0}>Select a class...</option>
          {classes?.map(c => <option key={c.id} value={c.id}>{c.classCode} ({c.currentStudents}/{c.maxStudents})</option>)}
        </Select>
      </FormField>

      <FormField label="Status" error={errors.status?.message as string}>
        <Select {...register('status')}>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="DROPPED">Dropped</option>
          <option value="COMPLETED">Completed</option>
        </Select>
      </FormField>

      <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse border-t pt-4">
        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50"
        >
          {isSubmitting || mutation.isPending ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || mutation.isPending}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
