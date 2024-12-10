import React from 'react';
import { File, FileSpreadsheet, Database } from 'lucide-react';

const ReportTypeSelector = ({ reportType, setReportType }) => {
  const reportTypes = [
    { id: 'pdf', name: 'PDF', icon: File, color: 'text-red-400' },
    { id: 'excel', name: 'Excel', icon: FileSpreadsheet, color: 'text-green-400' },
    { id: 'csv', name: 'CSV', icon: Database, color: 'text-blue-400' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {reportTypes.map(({ id, name, icon: Icon, color }) => (
        <button
          key={id}
          onClick={() => setReportType(id)}
          className={`p-4 rounded-xl transition-all duration-300 ${
            reportType === id
              ? 'bg-blue-500/10 border border-blue-500/20'
              : 'bg-[#1f2227] hover:bg-[#252830]'
          } flex flex-col items-center gap-2`}
        >
          <Icon className={color} size={24} />
          <span className="text-sm text-gray-300">{name}</span>
        </button>
      ))}
    </div>
  );
};

export default ReportTypeSelector;
