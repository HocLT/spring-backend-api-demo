import React from 'react';
import type { PromotionResponse } from '../../../types/yoedu';
import { formatVND, formatDate } from '../../../utils/format';

interface PromotionDetailProps {
  promotion: PromotionResponse;
}

export const PromotionDetail: React.FC<PromotionDetailProps> = ({ promotion }) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Promotion Information</h4>
        <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Code:</span>
            <p className="font-medium text-gray-900">{promotion.code}</p>
          </div>
          <div>
            <span className="text-gray-500">Discount:</span>
            <p className="font-medium text-gray-900">
              {promotion.discountType === 'PERCENTAGE' || promotion.discountType === 'PERCENT'
                ? `${promotion.discountValue}%`
                : formatVND(promotion.discountValue)}
            </p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Description:</span>
            <p className="font-medium text-gray-900">{promotion.description}</p>
          </div>
          <div>
            <span className="text-gray-500">Start Date:</span>
            <p className="font-medium text-gray-900">{formatDate(promotion.startDate)}</p>
          </div>
          <div>
            <span className="text-gray-500">End Date:</span>
            <p className="font-medium text-gray-900">{formatDate(promotion.endDate)}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Status:</span>
            <span className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              promotion.isActive ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10'
            }`}>
              {promotion.isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 border-t pt-4 flex justify-between">
        <p>Created: {formatDate(promotion.createdAt)}</p>
        <p>Updated: {formatDate(promotion.updatedAt)}</p>
      </div>
    </div>
  );
};
