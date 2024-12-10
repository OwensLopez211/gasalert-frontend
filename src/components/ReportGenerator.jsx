import React from 'react';
import { Download } from 'lucide-react';

const ReportGenerator = ({
  reportType,
  dateRange,
  loading,
  setLoading,
  lastGenerated,
  setLastGenerated,
}) => {
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
    <>
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
    </>
  );
};

export default ReportGenerator;
