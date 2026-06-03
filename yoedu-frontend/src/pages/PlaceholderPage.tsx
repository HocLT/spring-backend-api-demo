import React from 'react';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-500">This module is under construction.</p>
    </div>
  );
};

export default PlaceholderPage;
