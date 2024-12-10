import React from 'react';

const ReportSummary = ({ neumorphicClass }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className={`${neumorphicClass} p-4`}>
        <div className="text-center">
          <h3 className="text-gray-400 text-sm">Reportes Generados Hoy</h3>
          <p className="text-2xl font-bold text-white mt-2">12</p>
        </div>
      </div>
      <div className={`${neumorphicClass} p-4`}>
        <div className="text-center">
          <h3 className="text-gray-400 text-sm">Formato más usado</h3>
          <p className="text-2xl font-bold text-white mt-2">PDF</p>
        </div>
      </div>
      <div className={`${neumorphicClass} p-4`}>
        <div className="text-center">
          <h3 className="text-gray-400 text-sm">Rango más común</h3>
          <p className="text-2xl font-bold text-white mt-2">Última semana</p>
        </div>
      </div>
    </div>
  );
};

export default ReportSummary;
