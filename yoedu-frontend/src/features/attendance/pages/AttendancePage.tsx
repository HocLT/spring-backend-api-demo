import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { courseClassesApi } from '../../course-classes/course-classes.api';
import { PageHeader } from '../../../components/ui/PageHeader';
import { TakeAttendanceTab } from '../components/TakeAttendanceTab';
import { AttendanceMatrixTab } from '../components/AttendanceMatrixTab';

export const AttendancePage: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  const [activeTab, setActiveTab] = useState<'TAKE_ATTENDANCE' | 'MATRIX'>('TAKE_ATTENDANCE');

  const { data: classes } = useQuery({ 
    queryKey: ['course-classes', ''], 
    queryFn: () => courseClassesApi.getAll('') 
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance Management" />

      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select a Class:</label>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : '')}
          className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
        >
          <option value="">-- Choose a Class --</option>
          {classes?.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.classCode} ({c.currentStudents}/{c.maxStudents} students)
            </option>
          ))}
        </select>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('TAKE_ATTENDANCE')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'TAKE_ATTENDANCE'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Take Attendance
          </button>
          <button
            onClick={() => setActiveTab('MATRIX')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'MATRIX'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Attendance Matrix
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'TAKE_ATTENDANCE' ? (
          <TakeAttendanceTab selectedClassId={selectedClassId as number} />
        ) : (
          <AttendanceMatrixTab selectedClassId={selectedClassId as number} />
        )}
      </div>
    </div>
  );
};
