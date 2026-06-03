import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { billingApi } from '../billing.api';
import { studentsApi } from '../../students/students.api';
import { courseClassesApi } from '../../course-classes/course-classes.api';
import { referenceApi } from '../../reference/reference.api';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Modal } from '../../../components/ui/Modal';
import { FormField, Select, Input } from '../../../components/ui/FormField';
import { DataTable } from '../../../components/ui/DataTable';
import type { Column } from '../../../components/ui/DataTable';
import type { InvoiceResponse } from '../../../types/yoedu';
import { formatVND, formatDate } from '../../../utils/format';
import toast from 'react-hot-toast';

const invoiceSchema = z.object({
  studentId: z.coerce.number().min(1, 'Student is required'),
  classId: z.coerce.number().min(1, 'Class is required'),
  promotionId: z.coerce.number().optional(),
  billingMonth: z.string().min(1, 'Billing month is required'),
  dueDate: z.string().optional(),
  amountDue: z.coerce.number().optional(),
  description: z.string().optional()
});

export const BillingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: students } = useQuery({ queryKey: ['students', ''], queryFn: () => studentsApi.getAll('') });
  const { data: classes } = useQuery({ queryKey: ['course-classes', ''], queryFn: () => courseClassesApi.getAll('') });
  const { data: promotions } = useQuery({ queryKey: ['promotions'], queryFn: () => referenceApi.getPromotions() });

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', selectedStudentId],
    queryFn: () => billingApi.getStudentInvoices(selectedStudentId as number),
    enabled: !!selectedStudentId
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<any>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      studentId: 0,
      classId: 0,
      promotionId: 0,
      billingMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
      amountDue: 0,
    }
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      // API expects YYYY-MM-01
      const formattedData = {
        ...data,
        promotionId: data.promotionId ? data.promotionId : undefined,
        billingMonth: `${data.billingMonth}-01`,
        amountDue: data.amountDue || undefined,
        dueDate: data.dueDate || undefined
      };
      return billingApi.createInvoice(formattedData);
    },
    onSuccess: () => {
      toast.success('Invoice created successfully');
      setIsFormOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const columns: Column<InvoiceResponse>[] = [
    { key: 'invoiceNo', label: 'Invoice No.' },
    { 
      key: 'issueDate', 
      label: 'Issue Date',
      render: (i: any) => formatDate(i.issueDate)
    },
    { 
      key: 'dueDate', 
      label: 'Due Date',
      render: (i: any) => i.dueDate ? formatDate(i.dueDate) : '-'
    },
    { 
      key: 'amountDue', 
      label: 'Amount Due',
      render: (i: any) => formatVND(i.amountDue)
    },
    { 
      key: 'amountPaid', 
      label: 'Paid',
      render: (i: any) => formatVND(i.amountPaid)
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (i: any) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          i.status === 'PAID' ? 'bg-green-50 text-green-700 ring-green-600/20' :
          i.status === 'PARTIAL' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
          i.status === 'OVERPAID' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
          'bg-red-50 text-red-700 ring-red-600/10'
        }`}>
          {i.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Billing & Invoices" 
        onAdd={() => setIsFormOpen(true)}
        addLabel="Create Invoice"
      />

      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select a Student to view their invoices:</label>
        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : '')}
          className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
        >
          <option value="">-- Choose a Student --</option>
          {students?.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.studentCode} - {s.fullName}
            </option>
          ))}
        </select>
      </div>

      {!selectedStudentId ? (
        <div className="p-12 text-center text-gray-500 bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">
          Please select a student to view their invoices.
        </div>
      ) : (
        <DataTable
          data={invoices}
          columns={columns}
          isLoading={isLoading}
          isError={false}
          keyExtractor={(item: any) => item.id}
        />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Create Invoice"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Student" error={errors.studentId?.message as string} required>
            <Select {...register('studentId')}>
              <option value={0}>Select a student...</option>
              {students?.map(s => <option key={s.id} value={s.id}>{s.studentCode} - {s.fullName}</option>)}
            </Select>
          </FormField>
          
          <FormField label="Class" error={errors.classId?.message as string} required>
            <Select {...register('classId')}>
              <option value={0}>Select a class...</option>
              {classes?.map(c => <option key={c.id} value={c.id}>{c.classCode}</option>)}
            </Select>
          </FormField>
          
          <FormField label="Promotion (Optional)" error={errors.promotionId?.message as string}>
            <Select {...register('promotionId')}>
              <option value={0}>-- No Promotion --</option>
              {promotions?.map(p => <option key={p.id} value={p.id}>{p.code} ({p.discountType === 'PERCENTAGE' || p.discountType === 'PERCENT' ? p.discountValue + '%' : formatVND(p.discountValue)})</option>)}
            </Select>
          </FormField>

          <FormField label="Billing Month" error={errors.billingMonth?.message as string} required>
            <Input type="month" {...register('billingMonth')} />
          </FormField>
          
          <FormField label="Due Date" error={errors.dueDate?.message as string}>
            <Input type="date" {...register('dueDate')} />
          </FormField>

          <FormField label="Amount Due (Optional if auto-calculated)" error={errors.amountDue?.message as string}>
            <Input type="number" {...register('amountDue')} placeholder="e.g. 500000" />
          </FormField>
          
          <FormField label="Description" error={errors.description?.message as string}>
            <Input {...register('description')} placeholder="e.g. Monthly Tuition" />
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
