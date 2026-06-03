import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { promotionsApi } from '../promotions.api';
import type { PromotionResponse } from '../../../types/yoedu';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import type { Column } from '../../../components/ui/DataTable';
import { PromotionForm } from '../components/PromotionForm';
import { PromotionDetail } from '../components/PromotionDetail';
import toast from 'react-hot-toast';
import { formatVND, formatDate } from '../../../utils/format';

export const PromotionsList: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionResponse | undefined>(undefined);

  const { data: promotions, isLoading, isError } = useQuery({
    queryKey: ['promotions', debouncedSearch],
    queryFn: () => promotionsApi.getAll(debouncedSearch),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => promotionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promotion deleted successfully');
      setIsConfirmDeleteOpen(false);
      setSelectedPromotion(undefined);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete promotion');
      setIsConfirmDeleteOpen(false);
    }
  });

  const columns: Column<PromotionResponse>[] = [
    { key: 'code', label: 'Code' },
    { key: 'description', label: 'Description' },
    { 
      key: 'discountValue', 
      label: 'Discount',
      render: (p: any) => p.discountType === 'PERCENTAGE' || p.discountType === 'PERCENT'
        ? `${p.discountValue}%`
        : formatVND(p.discountValue)
    },
    { 
      key: 'endDate', 
      label: 'End Date',
      render: (p: any) => formatDate(p.endDate)
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (p: any) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          p.isActive ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10'
        }`}>
          {p.isActive ? 'ACTIVE' : 'INACTIVE'}
        </span>
      )
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Promotions" 
        onAdd={() => { setSelectedPromotion(undefined); setIsFormOpen(true); }}
        addLabel="Add Promotion"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search promotions by code..."
      />

      <DataTable
        data={promotions}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        keyExtractor={(item: any) => item.id}
        onView={(item: any) => { setSelectedPromotion(item); setIsDetailOpen(true); }}
        onEdit={(item: any) => { setSelectedPromotion(item); setIsFormOpen(true); }}
        onDelete={(item: any) => { setSelectedPromotion(item); setIsConfirmDeleteOpen(true); }}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedPromotion ? 'Edit Promotion' : 'Add New Promotion'}
        maxWidth="max-w-2xl"
      >
        <PromotionForm
          initialData={selectedPromotion}
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Promotion Details"
      >
        {selectedPromotion && <PromotionDetail promotion={selectedPromotion} />}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => selectedPromotion && deleteMutation.mutate(selectedPromotion.id)}
        title="Delete Promotion"
        message={`Are you sure you want to delete ${selectedPromotion?.code}?`}
        isProcessing={deleteMutation.isPending}
      />
    </div>
  );
};
