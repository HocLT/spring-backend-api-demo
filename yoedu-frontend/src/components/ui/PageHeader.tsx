import React from 'react';
import { Search, Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  searchPlaceholder?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onAdd,
  addLabel = 'Add New',
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {addLabel}
          </button>
        )}
      </div>

      {onSearchChange && (
        <div className="flex items-center px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
          />
        </div>
      )}
    </div>
  );
};
