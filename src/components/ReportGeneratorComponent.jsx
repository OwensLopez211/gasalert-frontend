import React, { useState } from 'react';
import { FileText, Calendar, Download, Loader2 } from 'lucide-react';
import ReportGenerationService from '../services/ReportGenerationService';

const ReportGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportParams, setReportParams] = useState({
    tankId: '',
    stationId: '',
    startDate: '',
    endDate: '',
    interval: 'day',
    format: 'pdf'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const reportService = new ReportGenerationService();
      reportService.setAuthToken(localStorage.getItem('access_token'));
      
      const reportBlob = await reportService.generateFullReport(reportParams);
      
      // Crear URL y link para descarga
      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_${reportParams.startDate}_${reportParams.endDate}.${reportParams.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-[#1A1D21] rounded-2xl border border-white/[0.05]">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Generador de Reportes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">ID del Tanque</label>
            <input
              type="text"
              name="tankId"
              value={reportParams.tankId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#1F2227] border border-white/[0.05] rounded-xl text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">ID de la Estación</label>
            <input
              type="text"
              name="stationId"
              value={reportParams.stationId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#1F2227] border border-white/[0.05] rounded-xl text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Fecha Inicio</label>
            <input
              type="date"
              name="startDate"
              value={reportParams.startDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#1F2227] border border-white/[0.05] rounded-xl text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Fecha Fin</label>
            <input
              type="date"
              name="endDate"
              value={reportParams.endDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#1F2227] border border-white/[0.05] rounded-xl text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Intervalo</label>
            <select
              name="interval"
              value={reportParams.interval}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#1F2227] border border-white/[0.05] rounded-xl text-white"
            >
              <option value="hour">Por Hora</option>
              <option value="day">Por Día</option>
              <option value="week">Por Semana</option>
              <option value="month">Por Mes</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Formato</label>
            <select
              name="format"
              value={reportParams.format}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#1F2227] border border-white/[0.05] rounded-xl text-white"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 
                   text-white rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Generar Reporte
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReportGenerator;