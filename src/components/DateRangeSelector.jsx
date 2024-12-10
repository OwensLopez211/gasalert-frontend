import React from 'react';

const DateRangeSelector = ({ dateRange, setDateRange }) => {
  const dateRanges = [
    { id: 'today', label: 'Hoy' },
    { id: 'week', label: 'Última semana' },
    { id: 'month', label: 'Último mes' },
    { id: 'year', label: 'Último año' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {dateRanges.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setDateRange(id)}
          className={`p-3 rounded-xl text-sm transition-all duration-300 ${
            dateRange === id
              ? 'bg-blue-500/10 border border-blue-500/20 text-white'
              : 'bg-[#1f2227] text-gray-400 hover:bg-[#252830] hover:text-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default DateRangeSelector;
