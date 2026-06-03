import React from 'react';
import type { CourseResponse } from '../../../types/yoedu';
import { formatVND, formatDate } from '../../../utils/format';

interface CourseDetailProps {
  course: CourseResponse;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Course Information</h4>
        <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center space-x-2 text-gray-500">
              <span>Code: {course.courseCode}</span>
            </div>
          </div>
          <div>
            <span className="text-gray-500">Name:</span>
            <p className="font-medium text-gray-900">{course.name}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Description:</span>
            <p className="font-medium text-gray-900">{course.description || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500">Tuition Fee:</span>
            <p className="font-medium text-gray-900">{formatVND(course.tuitionFee)}</p>
          </div>
          <div>
            <span className="text-gray-500">Duration (Months):</span>
            <p className="font-medium text-gray-900">{course.durationMonths || 'N/A'}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Status:</span>
            <span className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              course.isActive ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10'
            }`}>
              {course.isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 border-t pt-4 flex justify-between">
        <p>Created: {formatDate(course.createdAt)}</p>
        <p>Updated: {formatDate(course.updatedAt)}</p>
      </div>
    </div>
  );
};
