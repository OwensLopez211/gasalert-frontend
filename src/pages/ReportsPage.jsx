import React, { useState } from 'react';
import { FileText, Calendar } from 'lucide-react';
import ReportTypeSelector from '../components/ReportTypeSelector';
import DateRangeSelector from '../components/DateRangeSelector';
import ReportGenerator from '../components/ReportGenerator';
import ReportSummary from '../components/ReportSummary';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('pdf');
  const [dateRange, setDateRange] = useState('today');
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);

  const neumorphicClass = `
    rounded-[20px] bg-[#1a1d21]
    shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]
    border border-[#232529]
  `;

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Generador de Reportes
        </h1>
        <p className="text-gray-400 mt-2">
          Genera y descarga reportes personalizados de tu sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${neumorphicClass} p-6`}>
          <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="text-blue-400" size={20} />
            Formato del Reporte
          </h2>
          <ReportTypeSelector
            reportType={reportType}
            setReportType={setReportType}
          />
        </div>

        <div className={`${neumorphicClass} p-6`}>
          <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="text-blue-400" size={20} />
            Rango de Fechas
          </h2>
          <DateRangeSelector
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
      </div>

      <div className={`${neumorphicClass} p-6 text-center`}>
        <ReportGenerator
          reportType={reportType}
          dateRange={dateRange}
          loading={loading}
          setLoading={setLoading}
          lastGenerated={lastGenerated}
          setLastGenerated={setLastGenerated}
        />
      </div>

      <ReportSummary neumorphicClass={neumorphicClass} />
    </div>
  );
};

export default ReportsPage;
