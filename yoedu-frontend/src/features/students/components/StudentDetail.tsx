import React from 'react';
import type { StudentResponse } from '../../../types/yoedu';

interface StudentDetailProps {
  student: StudentResponse;
}

export const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Student Information</h4>
        <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Student Code:</span>
            <p className="font-medium text-gray-900">{student.studentCode}</p>
          </div>
          <div>
            <span className="text-gray-500">Full Name:</span>
            <p className="font-medium text-gray-900">{student.fullName}</p>
          </div>
          <div>
            <span className="text-gray-500">Date of Birth:</span>
            <p className="font-medium text-gray-900">{student.dob}</p>
          </div>
          <div>
            <span className="text-gray-500">Gender:</span>
            <p className="font-medium text-gray-900">{student.gender}</p>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <span className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              student.status === 'ACTIVE' ? 'bg-green-50 text-green-700 ring-green-600/20' :
              student.status === 'PAUSED' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
              'bg-red-50 text-red-700 ring-red-600/10'
            }`}>
              {student.status}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Address:</span>
            <p className="font-medium text-gray-900">{student.address || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Parent Link</h4>
        <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          {student.parentId ? (
            <p className="text-sm text-gray-900">
              Linked to Parent ID: <span className="font-medium">{student.parentId}</span>
              {/* Note: In a real scenario, we might want to fetch parent details here via parentId if the backend doesn't return nested parent info */}
            </p>
          ) : (
            <p className="text-sm text-gray-500 italic">No parent linked to this student.</p>
          )}
        </div>
      </div>
      
      <div className="text-xs text-gray-400 border-t pt-4">
        <p>Created At: {student.createdAt || 'N/A'}</p>
        <p>Updated At: {student.updatedAt || 'N/A'}</p>
      </div>
    </div>
  );
};
