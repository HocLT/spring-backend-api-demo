import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { coursesApi } from '../courses.api';
import type { CourseResponse } from '../../../types/yoedu';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormField, Input } from '../../../components/ui/FormField';

const courseSchema = z.object({
  courseCode: z.string().min(1, 'Course code is required'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  tuitionFee: z.coerce.number().min(0, 'Tuition fee cannot be negative'),
  durationMonths: z.coerce.number().min(1, 'Duration must be at least 1 month').optional(),
  isActive: z.boolean(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  initialData?: CourseResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CourseForm: React.FC<CourseFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseCode: initialData?.courseCode || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      tuitionFee: initialData?.tuitionFee || 0,
      durationMonths: initialData?.durationMonths || 1,
      isActive: initialData !== undefined ? initialData.isActive : true,
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      if (isEditing) {
        return coursesApi.update(initialData.id, data);
      } else {
        return coursesApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success(`Course ${isEditing ? 'updated' : 'created'} successfully`);
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
      <FormField label="Course Code" error={errors as any && errors.courseCode?.message} required>
        <Input {...register('courseCode')} disabled={isEditing} />
      </FormField>

      <FormField label="Course Name" error={errors as any && errors.name?.message} required>
        <Input {...register('name')} />
      </FormField>

      <FormField label="Description" error={errors as any && errors.description?.message}>
        <Input {...register('description')} />
      </FormField>

      <FormField label="Tuition Fee (VND)" error={errors as any && errors.tuitionFee?.message} required>
        <Input type="number" {...register('tuitionFee')} />
      </FormField>

      <FormField label="Duration (Months)" error={errors as any && errors.durationMonths?.message}>
        <Input type="number" {...register('durationMonths')} />
      </FormField>

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="isActive"
          {...register('isActive')}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 font-medium">
          Active Course
        </label>
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
