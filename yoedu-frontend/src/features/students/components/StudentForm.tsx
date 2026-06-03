import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { studentsApi } from '../students.api';
import type { StudentResponse } from '../../../types/yoedu';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const studentSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'DROPPED']).optional(),
  
  createWithParent: z.boolean(),
  parentFullName: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z.string().email('Invalid email').optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (data.createWithParent) {
    if (!data.parentFullName || data.parentFullName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Parent name is required',
        path: ['parentFullName'],
      });
    }
    if (!data.parentPhone || data.parentPhone.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Parent phone is required',
        path: ['parentPhone'],
      });
    }
  }
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  initialData?: StudentResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  const [showParentFields, setShowParentFields] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      dob: initialData?.dob || '',
      gender: initialData?.gender || 'MALE',
      address: initialData?.address || '',
      status: initialData?.status || 'ACTIVE',
      createWithParent: false,
    }
  });

  const watchCreateWithParent = watch('createWithParent');

  useEffect(() => {
    setShowParentFields(watchCreateWithParent);
  }, [watchCreateWithParent]);

  const mutation = useMutation({
    mutationFn: async (data: StudentFormValues) => {
      const { createWithParent, parentFullName, parentPhone, parentEmail, ...studentData } = data;
      
      if (isEditing) {
        if (createWithParent) {
          return studentsApi.updateWithParent(initialData.id, {
            ...studentData,
            parentFullName: parentFullName!,
            parentPhone: parentPhone!,
            parentEmail: parentEmail || undefined,
          });
        }
        return studentsApi.update(initialData.id, studentData);
      } else {
        if (createWithParent) {
          return studentsApi.createWithParent({
            ...studentData,
            parentFullName: parentFullName!,
            parentPhone: parentPhone!,
            parentEmail: parentEmail || undefined,
          });
        }
        return studentsApi.create(studentData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success(`Student ${isEditing ? 'updated' : 'created'} successfully`);
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  });

  const onSubmit = (data: StudentFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name *</label>
          <input
            {...register('fullName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
          <input
            type="date"
            {...register('dob')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          />
          {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender *</label>
          <select
            {...register('gender')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
          >
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="DROPPED">Dropped</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            {...register('address')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="createWithParent"
            {...register('createWithParent')}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="createWithParent" className="ml-2 block text-sm text-gray-900 font-medium">
            {isEditing ? 'Update/Link Parent Info' : 'Create with Parent Info'}
          </label>
        </div>

        {showParentFields && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Name *</label>
              <input
                {...register('parentFullName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
              {errors.parentFullName && <p className="mt-1 text-sm text-red-600">{errors.parentFullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Phone *</label>
              <input
                {...register('parentPhone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
              {errors.parentPhone && <p className="mt-1 text-sm text-red-600">{errors.parentPhone.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Parent Email (Optional)</label>
              <input
                type="email"
                {...register('parentEmail')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
              {errors.parentEmail && <p className="mt-1 text-sm text-red-600">{errors.parentEmail.message}</p>}
            </div>
          </div>
        )}
      </div>

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
