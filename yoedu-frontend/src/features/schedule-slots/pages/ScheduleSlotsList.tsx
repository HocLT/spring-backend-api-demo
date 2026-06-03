import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { scheduleSlotsApi } from '../schedule-slots.api';
import type { ScheduleSlotResponse } from '../../../types/yoedu';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import type { Column } from '../../../components/ui/DataTable';
import { ScheduleSlotForm } from '../components/ScheduleSlotForm';
import { ScheduleSlotDetail } from '../components/ScheduleSlotDetail';
import toast from 'react-hot-toast';

const getDayName = (day: number) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[day - 1] || 'Unknown';
};

export const ScheduleSlotsList: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlotResponse | undefined>(undefined);

  const { data: slots, isLoading, isError } = useQuery({
    queryKey: ['schedule-slots', debouncedSearch],
    queryFn: () => scheduleSlotsApi.getAll(debouncedSearch),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => scheduleSlotsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-slots'] });
      toast.success('Schedule slot deleted successfully');
      setIsConfirmDeleteOpen(false);
      setSelectedSlot(undefined);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete slot');
      setIsConfirmDeleteOpen(false);
    }
  });

  const columns: Column<ScheduleSlotResponse>[] = [
    { key: 'classId', label: 'Class ID' },
    { key: 'teacherId', label: 'Teacher ID' },
    { key: 'roomId', label: 'Room ID' },
    { 
      key: 'dayOfWeek', 
      label: 'Day',
      render: (s: any) => getDayName(s.dayOfWeek)
    },
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },
  ];

  return (
    <div>
      <PageHeader 
        title="Schedule Slots" 
        onAdd={() => { setSelectedSlot(undefined); setIsFormOpen(true); }}
        addLabel="Add Slot"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search slots..."
      />

      <DataTable
        data={slots}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        keyExtractor={(item: any) => item.id}
        onView={(item: any) => { setSelectedSlot(item); setIsDetailOpen(true); }}
        onEdit={(item: any) => { setSelectedSlot(item); setIsFormOpen(true); }}
        onDelete={(item: any) => { setSelectedSlot(item); setIsConfirmDeleteOpen(true); }}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedSlot ? 'Edit Schedule Slot' : 'Add New Schedule Slot'}
        maxWidth="max-w-2xl"
      >
        <ScheduleSlotForm
          initialData={selectedSlot}
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Schedule Slot Details"
      >
        {selectedSlot && <ScheduleSlotDetail slot={selectedSlot} />}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => selectedSlot && deleteMutation.mutate(selectedSlot.id)}
        title="Delete Schedule Slot"
        message={`Are you sure you want to delete this schedule slot?`}
        isProcessing={deleteMutation.isPending}
      />
    </div>
  );
};
