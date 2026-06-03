import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { scheduleSlotsApi } from '../schedule-slots.api';
import type { ScheduleSlotResponse } from '../../../types/yoedu';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormField, Input, Select } from '../../../components/ui/FormField';

const scheduleSlotSchema = z.object({
  classId: z.coerce.number().min(1, 'Class ID is required'),
  roomId: z.coerce.number().min(1, 'Room ID is required'),
  teacherId: z.coerce.number().min(1, 'Teacher ID is required'),
  dayOfWeek: z.coerce.number().min(1).max(7),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
}).refine(data => data.startTime < data.endTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type ScheduleSlotFormValues = z.infer<typeof scheduleSlotSchema>;

interface ScheduleSlotFormProps {
  initialData?: ScheduleSlotResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ScheduleSlotForm: React.FC<ScheduleSlotFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(scheduleSlotSchema),
    defaultValues: {
      classId: initialData?.classId || 0,
      roomId: initialData?.roomId || 0,
      teacherId: initialData?.teacherId || 0,
      dayOfWeek: initialData?.dayOfWeek || 1,
      startTime: initialData?.startTime || '08:00',
      endTime: initialData?.endTime || '10:00',
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: ScheduleSlotFormValues) => {
      if (isEditing) {
        return scheduleSlotsApi.update(initialData.id, data);
      } else {
        return scheduleSlotsApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-slots'] });
      toast.success(`Schedule Slot ${isEditing ? 'updated' : 'created'} successfully`);
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
        <FormField label="Class ID" error={errors as any && errors.classId?.message} required>
          <Input type="number" {...register('classId')} />
        </FormField>

        <FormField label="Room ID" error={errors as any && errors.roomId?.message} required>
          <Input type="number" {...register('roomId')} />
        </FormField>

        <FormField label="Teacher ID" error={errors as any && errors.teacherId?.message} required>
          <Input type="number" {...register('teacherId')} />
        </FormField>

        <FormField label="Day of Week" error={errors as any && errors.dayOfWeek?.message} required>
          <Select {...register('dayOfWeek')}>
            <option value={1}>Monday</option>
            <option value={2}>Tuesday</option>
            <option value={3}>Wednesday</option>
            <option value={4}>Thursday</option>
            <option value={5}>Friday</option>
            <option value={6}>Saturday</option>
            <option value={7}>Sunday</option>
          </Select>
        </FormField>

        <FormField label="Start Time" error={errors as any && errors.startTime?.message} required>
          <Input type="time" {...register('startTime')} />
        </FormField>

        <FormField label="End Time" error={errors as any && errors.endTime?.message} required>
          <Input type="time" {...register('endTime')} />
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
