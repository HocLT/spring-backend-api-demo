import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[] | undefined;
  columns: Column<T>[];
  isLoading: boolean;
  isError: boolean;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  keyExtractor: (item: T) => string | number;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  isError,
  onView,
  onEdit,
  onDelete,
  keyExtractor,
}: DataTableProps<T>) {
  if (isLoading) {
    return <div className="p-12 text-center text-gray-500 bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">Loading data...</div>;
  }

  if (isError) {
    return <div className="p-12 text-center text-red-500 bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">Error loading data. Please try again.</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-12 text-center text-gray-500 bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">No data found.</div>;
  }

  const hasActions = onView || onEdit || onDelete;

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`py-3.5 text-left text-sm font-semibold text-gray-900 ${index === 0 ? 'pl-4 sm:pl-6' : 'px-3'}`}
                >
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 w-32">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item) => (
              <tr key={keyExtractor(item)}>
                {columns.map((col, index) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap py-4 text-sm text-gray-500 ${index === 0 ? 'pl-4 font-medium text-gray-900 sm:pl-6' : 'px-3'}`}
                  >
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
                {hasActions && (
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end space-x-3">
                      {onView && (
                        <button onClick={() => onView(item)} className="text-gray-500 hover:text-gray-900" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-900" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(item)} className="text-red-600 hover:text-red-900" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
