import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { roomsApi } from '../rooms.api';
import type { RoomResponse } from '../../../types/yoedu';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import type { Column } from '../../../components/ui/DataTable';
import { RoomForm } from '../components/RoomForm';
import { RoomDetail } from '../components/RoomDetail';
import toast from 'react-hot-toast';

export const RoomsList: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | undefined>(undefined);

  const { data: rooms, isLoading, isError } = useQuery({
    queryKey: ['rooms', debouncedSearch],
    queryFn: () => roomsApi.getAll(debouncedSearch),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => roomsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room deleted successfully');
      setIsConfirmDeleteOpen(false);
      setSelectedRoom(undefined);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete room');
      setIsConfirmDeleteOpen(false);
    }
  });

  const columns: Column<RoomResponse>[] = [
    { key: 'name', label: 'Name' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'location', label: 'Location' },
  ];

  return (
    <div>
      <PageHeader 
        title="Rooms" 
        onAdd={() => { setSelectedRoom(undefined); setIsFormOpen(true); }}
        addLabel="Add Room"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search rooms by name..."
      />

      <DataTable
        data={rooms}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        keyExtractor={(item: any) => item.id}
        onView={(item: any) => { setSelectedRoom(item); setIsDetailOpen(true); }}
        onEdit={(item: any) => { setSelectedRoom(item); setIsFormOpen(true); }}
        onDelete={(item: any) => { setSelectedRoom(item); setIsConfirmDeleteOpen(true); }}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedRoom ? 'Edit Room' : 'Add New Room'}
      >
        <RoomForm
          initialData={selectedRoom}
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Room Details"
      >
        {selectedRoom && <RoomDetail room={selectedRoom} />}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => selectedRoom && deleteMutation.mutate(selectedRoom.id)}
        title="Delete Room"
        message={`Are you sure you want to delete ${selectedRoom?.name}?`}
        isProcessing={deleteMutation.isPending}
      />
    </div>
  );
};
