import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { attendancesApi } from '../attendances.api';
import { formatDate } from '../../../utils/format';

export const AttendanceMatrixTab: React.FC<{ selectedClassId: number }> = ({ selectedClassId }) => {
  const { data: matrix, isLoading, isError } = useQuery({
    queryKey: ['attendances-matrix', selectedClassId],
    queryFn: () => attendancesApi.getMatrixByClass(selectedClassId),
    enabled: !!selectedClassId,
  });

  if (!selectedClassId) {
    return <div className="p-8 text-center text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg">Please select a class first.</div>;
  }

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading matrix...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Failed to load attendance matrix. Note: The backend API endpoint might not be fully implemented yet.</div>;
  if (!matrix || !matrix.dates || matrix.dates.length === 0) {
    return <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm">No attendance records found for this class.</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-200">
              Student
            </th>
            {matrix.dates.map(date => (
              <th key={date} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                {formatDate(date)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {matrix.students.map(student => (
            <tr key={student.studentId}>
              <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-200">
                <div className="font-medium text-gray-900">{student.studentName}</div>
                <div className="text-gray-500 text-xs">{student.studentCode}</div>
              </td>
              {matrix.dates.map(date => {
                const status = student.attendances[date];
                return (
                  <td key={date} className="px-6 py-4 whitespace-nowrap text-center">
                    {!status ? (
                      <span className="text-gray-300">-</span>
                    ) : (
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        status === 'PRESENT' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                        status === 'ABSENT' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                        status === 'LATE' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                        'bg-gray-50 text-gray-700 ring-gray-600/20'
                      }`}>
                        {status.charAt(0)} {/* Show P, A, L, E */}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
