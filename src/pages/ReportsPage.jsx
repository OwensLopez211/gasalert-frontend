import React, { useState } from 'react';
import { FileText, Calendar, Download, Building } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Generar datos ficticios para el reporte
function generateFakeData() {
  const consumptionSummary = [
    { tank: 'Tanque 1', total_consumo: Math.floor(Math.random() * 1000), promedio_diario: Math.floor(Math.random() * 100) },
    { tank: 'Tanque 2', total_consumo: Math.floor(Math.random() * 1000), promedio_diario: Math.floor(Math.random() * 100) },
  ];

  const readingsHistory = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    readingsHistory.push({ 
      fecha: date.toISOString().split('T')[0],
      lectura_tanque_1: Math.floor(Math.random() * 500), 
      lectura_tanque_2: Math.floor(Math.random() * 500),
    });
  }

  const periodAlerts = [
    { alerta_id: 1, tanque_nombre: 'Tanque 1', nivel_detectado: Math.floor(Math.random() * 100), fecha_generacion: '2024-12-01', estado: Math.random() < 0.5 ? 'Activo' : 'Inactivo' },
    { alerta_id: 2, tanque_nombre: 'Tanque 2', nivel_detectado: Math.floor(Math.random() * 100), fecha_generacion: '2024-12-02', estado: Math.random() < 0.5 ? 'Activo' : 'Inactivo' },
  ];

  return {
    consumption_summary: consumptionSummary, 
    readings_history: readingsHistory,
    period_alerts: periodAlerts,
  };
}

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('today');
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const fakeData = generateFakeData();
      await generatePDF(fakeData);
      setLastGenerated(new Date());
    } catch (error) {
      console.error('Error generando reporte:', error);
      setError('Hubo un problema al generar el reporte. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (reportData) => {
    const doc = new jsPDF();
  
    // Título del reporte
    doc.setFontSize(18);
    doc.text("Reporte de Análisis de Tanques", 105, 20, null, null, 'center');
  
    let yPosition = 30;

    try {
      // Crear y renderizar el gráfico de comparación de consumo total entre tanques
      const consumptionChartCanvas = createCanvas(500, 300);
      await renderChart(consumptionChartCanvas, {
        type: 'bar',
        data: {
          labels: reportData.consumption_summary.map(row => row.tank),
          datasets: [{
            data: reportData.consumption_summary.map(row => row.total_consumo),
            backgroundColor: ['#3366CC', '#DC3912'],
          }]
        },
        options: {
          plugins: {
            title: { display: true, text: 'Consumo Total por Tanque' },
            legend: { display: false }
          }
        }
      });
      await addCanvasToPDF(doc, consumptionChartCanvas, 20, yPosition, 170, 100);
      yPosition += 110;
            // Crear y renderizar el gráfico de historial de lecturas
            const readingsChartCanvas = createCanvas(500, 300);
            await renderChart(readingsChartCanvas, {
              type: 'line',
              data: {
                labels: reportData.readings_history.map(row => row.fecha),
                datasets: [
                  { label: 'Tanque 1', data: reportData.readings_history.map(row => row.lectura_tanque_1), borderColor: '#3366CC', fill: false },
                  { label: 'Tanque 2', data: reportData.readings_history.map(row => row.lectura_tanque_2), borderColor: '#DC3912', fill: false },
                ]
              },
              options: {
                plugins: { title: { display: true, text: 'Historial de Lecturas' } }
              }
            });
            await addCanvasToPDF(doc, readingsChartCanvas, 20, yPosition, 170, 100);
            yPosition += 110;
        
            // Agregar tabla de alertas del periodo
            doc.autoTable({
              head: [['ID', 'Tanque', 'Nivel', 'Fecha', 'Estado']],
              body: reportData.period_alerts.map(row => [
                row.alerta_id, row.tanque_nombre, row.nivel_detectado, row.fecha_generacion, row.estado
              ]),
              startY: yPosition,
              theme: 'grid'
            });
        
            // Descargar el PDF
            doc.save(`reporte_${new Date().toISOString().split('T')[0]}.pdf`);
          } catch (error) {
            console.error("Error generando el reporte:", error);
            throw new Error("No se pudo generar el reporte debido a un error en los gráficos.");
          }
        };
        
        // Función para crear un canvas con dimensiones válidas
        const createCanvas = (width, height) => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          return canvas;
        };
        
        // Función para renderizar un gráfico en el canvas
        const renderChart = (canvas, config) => {
          return new Promise((resolve, reject) => {
            try {
              const chart = new Chart(canvas, {
                ...config,
                options: {
                  ...config.options,
                  animation: {
                    onComplete: () => resolve(chart), // Espera a que la animación termine
                  },
                },
              });
            } catch (error) {
              reject(error);
            }
          });
        };
        
        // Función para agregar un canvas renderizado al PDF
        const addCanvasToPDF = async (doc, canvas, x, y, width, height) => {
          return new Promise((resolve, reject) => {
            try {
              const imageData = canvas.toDataURL('image/png'); // Convertir canvas a imagen PNG
              doc.addImage(imageData, 'PNG', x, y, width, height);
              resolve();
            } catch (error) {
              reject(new Error('Error al agregar el gráfico al PDF: ' + error.message));
            }
          });
        };
      
        return (
          <div className="container mx-auto p-6 max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Generador de Reportes
              </h1>
              <p className="text-gray-400 mt-2">Genera reportes detallados de análisis y consumo</p>
            </div>
      
            <div className="space-y-6">
              <div className="bg-[#1a1d21] rounded-2xl border border-white/[0.05] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Building className="text-blue-400" size={20} />
                  <h2 className="text-lg font-semibold text-white">Estación</h2>
                </div>
                <p className="text-gray-400">Estación de prueba</p>
              </div>
      
              <div className="bg-[#1a1d21] rounded-2xl border border-white/[0.05] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="text-blue-400" size={20} />
                  <h2 className="text-lg font-semibold text-white">Rango de Fechas</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['today', 'week', 'month'].map(range => (
                    <button
                      key={range}
                      onClick={() => setDateRange(range)}
                      className={`p-2 rounded-lg transition-colors ${dateRange === range ? 'bg-blue-500 text-white' : 'bg-[#1f2227] text-gray-400 hover:bg-[#252830]'}`}
                    >
                      {range === 'today' ? 'Hoy' : range === 'week' ? 'Última semana' : 'Último mes'}
                    </button>
                  ))}
                </div>
              </div>
      
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
                  {error}
                </div>
              )}
      
              <div className="bg-[#1a1d21] rounded-2xl border border-white/[0.05] p-6">
                <button
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-medium transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generando reporte...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Download size={20} />
                      <span>Generar Reporte</span>
                    </div>
                  )}
                </button>
      
                {lastGenerated && (
                  <p className="text-gray-400 text-sm text-center mt-3">
                    Último reporte generado: {lastGenerated.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      };
      
      export default ReportsPage;
      