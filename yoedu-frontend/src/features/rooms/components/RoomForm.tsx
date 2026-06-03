import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { roomsApi } from '../rooms.api';
import type { RoomResponse } from '../../../types/yoedu';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormField, Input } from '../../../components/ui/FormField';

const roomSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  location: z.string().optional(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface RoomFormProps {
  initialData?: RoomResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export const RoomForm: React.FC<RoomFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: initialData?.name || '',
      capacity: initialData?.capacity || 20,
      location: initialData?.location || '',
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: RoomFormValues) => {
      if (isEditing) {
        return roomsApi.update(initialData.id, data);
      } else {
        return roomsApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success(`Room ${isEditing ? 'updated' : 'created'} successfully`);
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
      <FormField label="Room Name" error={errors as any && errors.name?.message} required>
        <Input {...register('name')} placeholder="e.g., Room 101" />
      </FormField>

      <FormField label="Capacity" error={errors as any && errors.capacity?.message} required>
        <Input type="number" {...register('capacity')} />
      </FormField>

      <FormField label="Location" error={errors as any && errors.location?.message}>
        <Input {...register('location')} placeholder="e.g., Building A, Floor 1" />
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
