import React, { useEffect, useState } from 'react';
import { DropletIcon } from 'lucide-react';
import axios from 'axios';

const AverageConsumption = ({ tanqueId }) => {
  const [promedios, setPromedios] = useState({ diario: null, semanal: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsumoPromedio = async () => {
      setLoading(true);
      try {
        // Obtén el token de autenticación
        const token = localStorage.getItem('access_token');
        const api = axios.create({
          baseURL: 'http://localhost:8000/api',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Solicita el consumo promedio
        const response = await api.get('/tanks/analytics/consumo-promedio/', {
          params: { tanque_id: tanqueId, dias: 7 },
        });

        // Guarda los promedios
        setPromedios({
          diario: response.data.promedio_diario,
          semanal: response.data.promedio_semanal,
        });
      } catch (err) {
        console.error('Error fetching consumo promedio:', err);
        setError('No se pudo cargar el consumo promedio');
      } finally {
        setLoading(false);
      }
    };

    fetchConsumoPromedio();
  }, [tanqueId]);

  const neumorphicClass = `
    rounded-[20px] bg-[#1a1d21]
    shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]
    border border-[#232529]
  `;

  return (
    <div className={`${neumorphicClass} p-4`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-400">Consumo Promedio</h3>
        <DropletIcon className="text-blue-500" size={20} />
      </div>
      {loading ? (
        <div className="text-gray-400">Cargando...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="text-xl font-bold text-white">
            Diario: {promedios.diario} L/día
          </div>
          <div className="text-xl font-bold text-white">
            Semanal: {promedios.semanal} L/semana
          </div>
        </>
      )}
      {!loading && !error && <div className="text-sm text-green-500">Datos reales</div>}
    </div>
  );
};

export default AverageConsumption;
