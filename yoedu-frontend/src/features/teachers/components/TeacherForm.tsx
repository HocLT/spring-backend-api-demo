import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { teachersApi } from '../teachers.api';
import type { TeacherResponse } from '../../../types/yoedu';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormField, Input, Select } from '../../../components/ui/FormField';

const teacherSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is too short'),
  teacherRole: z.enum(['TEACHER', 'ASSISTANT', 'BOTH']),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  initialData?: TeacherResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      teacherRole: initialData?.teacherRole || 'TEACHER',
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: TeacherFormValues) => {
      if (isEditing) {
        return teachersApi.update(initialData.id, data);
      } else {
        return teachersApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success(`Teacher ${isEditing ? 'updated' : 'created'} successfully`);
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
      <FormField label="Full Name" error={errors as any && errors.fullName?.message} required>
        <Input {...register('fullName')} />
      </FormField>

      <FormField label="Email" error={errors as any && errors.email?.message} required>
        <Input type="email" {...register('email')} />
      </FormField>

      <FormField label="Phone" error={errors as any && errors.phone?.message} required>
        <Input {...register('phone')} />
      </FormField>

      <FormField label="Role" error={errors as any && errors.teacherRole?.message} required>
        <Select {...register('teacherRole')}>
          <option value="TEACHER">Teacher</option>
          <option value="ASSISTANT">Assistant</option>
          <option value="BOTH">Both</option>
        </Select>
      </FormField>

      <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
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
