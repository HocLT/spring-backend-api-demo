import React from 'react';
import type { TeacherResponse } from '../../../types/yoedu';
import { formatDate } from '../../../utils/format';

interface TeacherDetailProps {
  teacher: TeacherResponse;
}

export const TeacherDetail: React.FC<TeacherDetailProps> = ({ teacher }) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Teacher Information</h4>
        <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Teacher Code:</span>
            <p className="font-medium text-gray-900">{teacher.teacherCode}</p>
          </div>
          <div>
            <span className="text-gray-500">Full Name:</span>
            <p className="font-medium text-gray-900">{teacher.fullName}</p>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>
            <p className="font-medium text-gray-900">{teacher.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>
            <p className="font-medium text-gray-900">{teacher.phone}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Role:</span>
            <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
              {teacher.teacherRole}
            </span>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 border-t pt-4 flex justify-between">
        <p>Created: {formatDate(teacher.createdAt)}</p>
        <p>Updated: {formatDate(teacher.updatedAt)}</p>
      </div>
    </div>
  );
};
