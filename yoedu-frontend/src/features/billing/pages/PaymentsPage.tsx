import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { billingApi } from '../billing.api';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Modal } from '../../../components/ui/Modal';
import { FormField, Select, Input } from '../../../components/ui/FormField';
import { DataTable } from '../../../components/ui/DataTable';
import type { Column } from '../../../components/ui/DataTable';
import type { PaymentResponse } from '../../../types/yoedu';
import { formatVND, formatDate } from '../../../utils/format';
import toast from 'react-hot-toast';

const paymentSchema = z.object({
  invoiceId: z.coerce.number().min(1, 'Invoice ID is required'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER']),
  paidAt: z.string().min(1, 'Payment date/time is required'),
  referenceNote: z.string().optional()
});

export const PaymentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments', 'all'],
    queryFn: () => billingApi.getAllPayments(),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<any>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoiceId: '',
      amount: 0,
      paymentMethod: 'BANK_TRANSFER',
      paidAt: new Date().toISOString().slice(0, 16), // YYYY-MM-DDThh:mm
      referenceNote: ''
    }
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      // Need valid ISO string like "2023-10-15T14:30:00Z"
      // If the input is datetime-local it's missing seconds and Z, so append it
      const formattedData = {
        ...data,
        paidAt: new Date(data.paidAt).toISOString()
      };
      return billingApi.createPayment(formattedData);
    },
    onSuccess: () => {
      toast.success('Payment recorded successfully');
      setIsFormOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const columns: Column<PaymentResponse>[] = [
    { key: 'invoiceId', label: 'Invoice ID' },
    { 
      key: 'paymentDate', 
      label: 'Payment Date',
      render: (p: any) => formatDate(p.paymentDate)
    },
    { 
      key: 'amount', 
      label: 'Amount Paid',
      render: (p: any) => formatVND(p.amount)
    },
    { 
      key: 'paymentMethod', 
      label: 'Method',
      render: (p: any) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          p.paymentMethod === 'CASH' ? 'bg-purple-50 text-purple-700 ring-purple-600/20' : 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
        }`}>
          {p.paymentMethod.replace('_', ' ')}
        </span>
      )
    },
    { key: 'referenceNote', label: 'Reference / Note' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Payments" 
        onAdd={() => setIsFormOpen(true)}
        addLabel="Record Payment"
      />

      <DataTable
        data={payments}
        columns={columns}
        isLoading={isLoading}
        isError={false}
        keyExtractor={(item: any) => item.id}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Record Payment"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Invoice ID" error={errors.invoiceId?.message as string} required>
            <Input type="number" {...register('invoiceId')} placeholder="Enter Invoice ID..." />
          </FormField>
          
          <FormField label="Amount" error={errors.amount?.message as string} required>
            <Input type="number" {...register('amount')} placeholder="e.g. 500000" />
          </FormField>
          
          <FormField label="Payment Method" error={errors.paymentMethod?.message as string} required>
            <Select {...register('paymentMethod')}>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH">Cash</option>
            </Select>
          </FormField>

          <FormField label="Payment Date & Time" error={errors.paidAt?.message as string} required>
            <Input type="datetime-local" {...register('paidAt')} />
          </FormField>
          
          <FormField label="Reference Note" error={errors.referenceNote?.message as string}>
            <Input {...register('referenceNote')} placeholder="Txn ID, etc." />
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
              onClick={() => setIsFormOpen(false)}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
