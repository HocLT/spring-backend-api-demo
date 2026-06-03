import React from 'react';
import type { RoomResponse } from '../../../types/yoedu';
import { formatDate } from '../../../utils/format';

interface RoomDetailProps {
  room: RoomResponse;
}

export const RoomDetail: React.FC<RoomDetailProps> = ({ room }) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Room Information</h4>
        <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Name:</span>
            <p className="font-medium text-gray-900">{room.name}</p>
          </div>
          <div>
            <span className="text-gray-500">Capacity:</span>
            <p className="font-medium text-gray-900">{room.capacity} students</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Location:</span>
            <p className="font-medium text-gray-900">{room.location || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 border-t pt-4 flex justify-between">
        <p>Created: {formatDate(room.createdAt)}</p>
        <p>Updated: {formatDate(room.updatedAt)}</p>
      </div>
    </div>
  );
};
