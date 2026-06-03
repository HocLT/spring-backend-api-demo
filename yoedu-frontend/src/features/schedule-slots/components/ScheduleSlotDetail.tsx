import React from 'react';
import type { ScheduleSlotResponse } from '../../../types/yoedu';
import { formatDate } from '../../../utils/format';

interface ScheduleSlotDetailProps {
  slot: ScheduleSlotResponse;
}

const getDayName = (day: number) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[day - 1] || 'Unknown';
};

export const ScheduleSlotDetail: React.FC<ScheduleSlotDetailProps> = ({ slot }) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Schedule Information</h4>
        <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Class ID:</span>
            <p className="font-medium text-gray-900">{slot.classId}</p>
          </div>
          <div>
            <span className="text-gray-500">Teacher ID:</span>
            <p className="font-medium text-gray-900">{slot.teacherId}</p>
          </div>
          <div>
            <span className="text-gray-500">Room ID:</span>
            <p className="font-medium text-gray-900">{slot.roomId}</p>
          </div>
          <div>
            <span className="text-gray-500">Day of Week:</span>
            <p className="font-medium text-gray-900">{getDayName(slot.dayOfWeek)}</p>
          </div>
          <div>
            <span className="text-gray-500">Start Time:</span>
            <p className="font-medium text-gray-900">{slot.startTime}</p>
          </div>
          <div>
            <span className="text-gray-500">End Time:</span>
            <p className="font-medium text-gray-900">{slot.endTime}</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 border-t pt-4 flex justify-between">
        <p>Created: {formatDate(slot.createdAt)}</p>
        <p>Updated: {formatDate(slot.updatedAt)}</p>
      </div>
    </div>
  );
};
