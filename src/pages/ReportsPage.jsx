import React, { useState } from 'react';
import { FileText, Download, File, FileSpreadsheet, Database, Calendar } from 'lucide-react';

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

  const reportTypes = [
    { id: 'pdf', name: 'PDF', icon: File, color: 'text-red-400' },
    { id: 'excel', name: 'Excel', icon: FileSpreadsheet, color: 'text-green-400' },
    { id: 'csv', name: 'CSV', icon: Database, color: 'text-blue-400' }
  ];

  const dateRanges = [
    { id: 'today', label: 'Hoy' },
    { id: 'week', label: 'Última semana' },
    { id: 'month', label: 'Último mes' },
    { id: 'year', label: 'Último año' }
  ];

  const downloadReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const url = `http://localhost:8000/api/reports/${reportType}/?range=${dateRange}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo generar el reporte');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `reporte_${dateRange}_${new Date().toISOString().split('T')[0]}.${reportType}`;
      link.click();
      
      setLastGenerated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error al descargar el reporte:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Selector de Tipo de Reporte */}
        <div className={`${neumorphicClass} p-6`}>
          <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="text-blue-400" size={20} />
            Formato del Reporte
          </h2>
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
        </div>

        {/* Selector de Rango de Fechas */}
        <div className={`${neumorphicClass} p-6`}>
          <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="text-blue-400" size={20} />
            Rango de Fechas
          </h2>
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
        </div>
      </div>

      {/* Sección de Generación */}
      <div className={`${neumorphicClass} p-6 text-center`}>
        <button
          onClick={downloadReport}
          disabled={loading}
          className="relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium
                   shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generando...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Descargar Reporte</span>
            </>
          )}
        </button>
        {lastGenerated && (
          <p className="text-gray-400 text-sm mt-4">
            Último reporte generado: {lastGenerated}
          </p>
        )}
      </div>

      {/* Información Adicional */}
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
    </div>
  );
};

export default ReportsPage;