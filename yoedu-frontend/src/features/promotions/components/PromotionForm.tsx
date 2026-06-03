import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { promotionsApi } from '../promotions.api';
import type { PromotionResponse } from '../../../types/yoedu';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormField, Input, Select } from '../../../components/ui/FormField';

const promotionSchema = z.object({
  code: z.string().min(2, 'Code must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  discountType: z.enum(['PERCENTAGE', 'FIXED', 'PERCENT', 'AMOUNT']),
  discountValue: z.coerce.number().min(0, 'Discount value cannot be negative'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isActive: z.boolean(),
}).refine(data => data.startDate <= data.endDate, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

interface PromotionFormProps {
  initialData?: PromotionResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PromotionForm: React.FC<PromotionFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      code: initialData?.code || '',
      description: initialData?.description || '',
      discountType: initialData?.discountType || 'PERCENTAGE',
      discountValue: initialData?.discountValue || 0,
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      isActive: initialData !== undefined ? initialData.isActive : true,
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: PromotionFormValues) => {
      if (isEditing) {
        return promotionsApi.update(initialData.id, data);
      } else {
        return promotionsApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success(`Promotion ${isEditing ? 'updated' : 'created'} successfully`);
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
        <FormField label="Promotion Code" error={errors as any && errors.code?.message} required>
          <Input {...register('code')} disabled={isEditing} />
        </FormField>

        <FormField label="Discount Type" error={errors as any && errors.discountType?.message} required>
          <Select {...register('discountType')}>
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed Amount (VND)</option>
          </Select>
        </FormField>

        <FormField label="Discount Value" error={errors as any && errors.discountValue?.message} required>
          <Input type="number" {...register('discountValue')} />
        </FormField>

        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 font-medium">
            Active Promotion
          </label>
        </div>

        <div className="md:col-span-2">
          <FormField label="Description" error={errors as any && errors.description?.message} required>
            <Input {...register('description')} />
          </FormField>
        </div>

        <FormField label="Start Date" error={errors as any && errors.startDate?.message} required>
          <Input type="date" {...register('startDate')} />
        </FormField>

        <FormField label="End Date" error={errors as any && errors.endDate?.message} required>
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
