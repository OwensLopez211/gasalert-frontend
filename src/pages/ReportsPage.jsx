import React, { useState, useContext,  useEffect } from 'react';
import { FileText, Calendar, Building, Container, Download } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const DateRangeSelector = ({ dateRange, setDateRange }) => {
  const ranges = [
    { id: 'today', label: 'Hoy' },
    { id: 'week', label: 'Última semana' },
    { id: 'month', label: 'Último mes' }
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {ranges.map(range => (
        <button
          key={range.id}
          onClick={() => setDateRange(range.id)}
          className={`p-2 rounded-lg transition-colors ${
            dateRange === range.id
              ? 'bg-blue-500 text-white'
              : 'bg-[#1f2227] text-gray-400 hover:bg-[#252830]'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

const ReportsPage = () => {
  const { user } = useContext(AuthContext);
  const [dateRange, setDateRange] = useState('today');
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [selectedTank, setSelectedTank] = useState('');
  const [error, setError] = useState(null);

  const [tanks, setTanks] = useState([]); // Estado para almacenar los tanques
  const estacionId = user?.estaciones?.[0]?.id;

  // Fetch de los tanques de la estación
  useEffect(() => {
    const fetchTanks = async () => {
      if (!estacionId) return;
      
      try {
        const response = await axios.get(`${API_URL}/tanks/`, {
          params: { estacion_id: estacionId },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setTanks(response.data);
      } catch (error) {
        console.error('Error al obtener tanques:', error);
        setError('No se pudieron cargar los tanques');
      }
    };

    fetchTanks();
  }, [estacionId]);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedTank || !estacionId) {
        throw new Error('Por favor selecciona un tanque');
      }

      const { startDate, endDate } = parseDateRange(dateRange);

      const response = await axios.get(`${API_URL}/reports/generate/`, {
        params: {
          tank_id: selectedTank,
          station_id: estacionId,
          start_date: startDate,
          end_date: endDate,
          interval: 'day'
        },
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${startDate}_${endDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setLastGenerated(new Date());
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      setError(error.message || 'No se pudo generar el reporte');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Generador de Reportes
        </h1>
        <p className="text-gray-400 mt-2">
          Genera reportes detallados de análisis y consumo
        </p>
      </div>

      <div className="space-y-6">
        {/* Estación Info */}
        <div className="bg-[#1a1d21] rounded-2xl border border-white/[0.05] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building className="text-blue-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Estación</h2>
          </div>
          <p className="text-gray-400">
            {user?.estaciones?.[0]?.nombre || 'Estación no seleccionada'}
          </p>
        </div>

        {/* Selector de Tanque */}
        <div className="bg-[#1a1d21] rounded-2xl border border-white/[0.05] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Container className="text-blue-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Seleccionar Tanque</h2>
          </div>
          <select
            value={selectedTank}
            onChange={(e) => setSelectedTank(e.target.value)}
            className="w-full px-4 py-2 bg-[#1f2227] border border-white/[0.05] rounded-xl 
                      text-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">Selecciona un tanque</option>
            {tanks.map(tank => (
              <option key={tank.id} value={tank.id}>
                {tank.nombre} - {tank.tipo_combustible_nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Rango de Fechas */}
        <div className="bg-[#1a1d21] rounded-2xl border border-white/[0.05] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-blue-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Rango de Fechas</h2>
          </div>
          <DateRangeSelector
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Botón de Generación */}
        <div className="bg-[#1a1d21] rounded-2xl border border-white/[0.05] p-6">
          <button
            onClick={handleGenerateReport}
            disabled={loading || !selectedTank}
            className={`
              w-full py-3 rounded-xl text-white font-medium
              transition-all duration-300
              ${loading || !selectedTank
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              }
            `}
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