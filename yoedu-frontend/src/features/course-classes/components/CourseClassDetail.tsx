import React from 'react';
import type { CourseClassResponse } from '../../../types/yoedu';
import { formatDate } from '../../../utils/format';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../../courses/courses.api';
import { referenceApi } from '../../reference/reference.api';

interface CourseClassDetailProps {
  courseClass: CourseClassResponse;
}

export const CourseClassDetail: React.FC<CourseClassDetailProps> = ({ courseClass }) => {
  const { data: courses } = useQuery({ queryKey: ['courses'], queryFn: () => coursesApi.getAll('') });
  const { data: teachers } = useQuery({ queryKey: ['ref-teachers'], queryFn: referenceApi.getTeachers });
  const { data: rooms } = useQuery({ queryKey: ['ref-rooms'], queryFn: referenceApi.getRooms });

  const courseName = courses?.find(c => c.id === courseClass.courseId)?.name || `Course ID: ${courseClass.courseId}`;
  const teacherName = teachers?.find(t => t.id === courseClass.teacherId)?.fullName || `Teacher ID: ${courseClass.teacherId}`;
  const roomName = rooms?.find(r => r.id === courseClass.roomId)?.name || `Room ID: ${courseClass.roomId}`;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Class Information</h4>
        <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Class Code:</span>
            <p className="font-medium text-gray-900">{courseClass.classCode}</p>
          </div>
          <div>
            <span className="text-gray-500">Course:</span>
            <p className="font-medium text-gray-900">{courseName}</p>
          </div>
          <div>
            <span className="text-gray-500">Teacher:</span>
            <p className="font-medium text-gray-900">{courseClass.teacherId ? teacherName : 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500">Room:</span>
            <p className="font-medium text-gray-900">{courseClass.roomId ? roomName : 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500">Max Students:</span>
            <p className="font-medium text-gray-900">{courseClass.maxStudents}</p>
          </div>
          <div>
            <span className="text-gray-500">Current Students:</span>
            <p className="font-medium text-gray-900">{courseClass.currentStudents}</p>
          </div>
          <div>
            <span className="text-gray-500">Start Date:</span>
            <p className="font-medium text-gray-900">{formatDate(courseClass.startDate)}</p>
          </div>
          <div>
            <span className="text-gray-500">End Date:</span>
            <p className="font-medium text-gray-900">{formatDate(courseClass.endDate)}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Status:</span>
            <span className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              courseClass.status === 'OPEN' ? 'bg-green-50 text-green-700 ring-green-600/20' :
              courseClass.status === 'ONGOING' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
              courseClass.status === 'FULL' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
              'bg-gray-50 text-gray-600 ring-gray-500/10'
            }`}>
              {courseClass.status}
            </span>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 border-t pt-4 flex justify-between">
        <p>Created: {formatDate(courseClass.createdAt)}</p>
        <p>Updated: {formatDate(courseClass.updatedAt)}</p>
      </div>
    </div>
  );
};
