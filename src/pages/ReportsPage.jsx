import React, { useState } from 'react';
import { FileText, Calendar } from 'lucide-react';
import ReportTypeSelector from '../components/ReportTypeSelector';
import DateRangeSelector from '../components/DateRangeSelector';
import ReportSummary from '../components/ReportSummary';
import ReportGenerator from '../components/reports/ReportGenerator'; // Ajusta el path si es necesario

const ReportsPage = () => {
  const [reportType, setReportType] = useState('pdf');
  const [dateRange, setDateRange] = useState('today');
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);

      // Instanciar ReportGenerator
      const generator = new ReportGenerator();

      // Convertir rango de fechas
      const { startDate, endDate } = parseDateRange(dateRange);

      // Parámetros para el reporte
      const params = {
        tanque_id: 1, // Reemplazar con lógica para obtener el tanque deseado
        fecha_inicio: startDate,
        fecha_fin: endDate,
      };

      // Generar y descargar el reporte
      const pdfBytes = await generator.generateReport(params);

      // Crear enlace para descargar el PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setLastGenerated(new Date());
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      alert('No se pudo generar el reporte. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const neumorphicClass = `
    rounded-[20px] bg-[#1a1d21]
    shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]
    border border-[#232529]
  `;

  const parseDateRange = (range) => {
    const today = new Date();
    let startDate, endDate;
    switch (range) {
      case 'today':
        startDate = endDate = today.toISOString().split('T')[0];
        break;
      case 'week':
        startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case 'month':
        startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      default:
        startDate = endDate = today.toISOString().split('T')[0];
    }
    return { startDate, endDate };
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
        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className={`btn ${loading ? 'btn-disabled' : 'btn-primary'}`}
        >
          {loading ? 'Generando...' : 'Generar Reporte'}
        </button>
      </div>

      <ReportSummary neumorphicClass={neumorphicClass} />
    </div>
  );
};

export default ReportsPage;
