import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { courseClassesApi } from '../course-classes.api';
import { coursesApi } from '../../courses/courses.api';
import { referenceApi } from '../../reference/reference.api';
import type { CourseClassResponse } from '../../../types/yoedu';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { FormField, Input, Select } from '../../../components/ui/FormField';

const classSchema = z.object({
  classCode: z.string().min(2, 'Code must be at least 2 characters'),
  courseId: z.coerce.number().min(1, 'Course is required'),
  teacherId: z.coerce.number().optional(),
  roomId: z.coerce.number().optional(),
  maxStudents: z.coerce.number().min(1, 'Max students must be at least 1'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  status: z.enum(['OPEN', 'ONGOING', 'CLOSED', 'FULL']).optional(),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassFormProps {
  initialData?: CourseClassResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ClassForm: React.FC<ClassFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      classCode: initialData?.classCode || '',
      courseId: initialData?.courseId || 0,
      teacherId: initialData?.teacherId || 0,
      roomId: initialData?.roomId || 0,
      maxStudents: initialData?.maxStudents || 20,
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      status: initialData?.status || 'OPEN',
    }
  });

  const { data: courses } = useQuery({ queryKey: ['courses'], queryFn: () => coursesApi.getAll('') });
  const { data: teachers } = useQuery({ queryKey: ['ref-teachers'], queryFn: referenceApi.getTeachers });
  const { data: rooms } = useQuery({ queryKey: ['ref-rooms'], queryFn: referenceApi.getRooms });

  const mutation = useMutation({
    mutationFn: async (data: ClassFormValues) => {
      const payload = {
        ...data,
        teacherId: data.teacherId || undefined,
        roomId: data.roomId || undefined,
        endDate: data.endDate || undefined,
      };

      if (isEditing) {
        return courseClassesApi.update(initialData.id, payload);
      } else {
        return courseClassesApi.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-classes'] });
      toast.success(`Class ${isEditing ? 'updated' : 'created'} successfully`);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Class Code" error={errors.classCode?.message as string} required>
          <Input {...register('classCode')} disabled={isEditing} />
        </FormField>

        <FormField label="Course" error={errors as any && errors.courseId?.message as string} required>
          <Select {...register('courseId')}>
            <option value={0}>Select a course...</option>
            {courses?.map((c: any) => <option key={c.id} value={c.id}>{c.courseCode} - {c.name}</option>)}
          </Select>
        </FormField>

        <FormField label="Teacher" error={errors.teacherId?.message as string}>
          <Select {...register('teacherId')}>
            <option value={0}>Select a teacher...</option>
            {teachers?.map(t => <option key={t.id} value={t.id}>{t.fullName} ({t.teacherCode})</option>)}
          </Select>
        </FormField>

        <FormField label="Room" error={errors.roomId?.message as string}>
          <Select {...register('roomId')}>
            <option value={0}>Select a room...</option>
            {rooms?.map(r => <option key={r.id} value={r.id}>{r.name} ({r.capacity} pax)</option>)}
          </Select>
        </FormField>

        <FormField label="Max Students" error={errors.maxStudents?.message as string} required>
          <Input type="number" {...register('maxStudents')} />
        </FormField>

        <FormField label="Status" error={errors.status?.message as string}>
          <Select {...register('status')}>
            <option value="OPEN">Open</option>
            <option value="ONGOING">Ongoing</option>
            <option value="FULL">Full</option>
            <option value="CLOSED">Closed</option>
          </Select>
        </FormField>

        <FormField label="Start Date" error={errors.startDate?.message as string} required>
          <Input type="date" {...register('startDate')} />
        </FormField>

        <FormField label="End Date" error={errors.endDate?.message as string}>
          <Input type="date" {...register('endDate')} />
        </FormField>
      </div>

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
