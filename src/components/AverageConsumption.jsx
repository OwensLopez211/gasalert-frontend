import React, { useEffect, useState } from 'react';
import { DropletIcon } from 'lucide-react';
import axios from 'axios';
import LoaderAnalysis from './LoaderAnalysis';

const AverageConsumption = ({ tanqueId, dias }) => {
  const [promedio, setPromedio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsumoPromedio = async () => {
      setLoading(true);
      setError(null); // Reinicia cualquier error anterior

      try {
        const token = localStorage.getItem('access_token');

        // Configuración del cliente Axios
        const api = axios.create({
          baseURL: 'http://localhost:8000/api',
          headers: { Authorization: `Bearer ${token}` },
        });

        // Llamada a la API
        const response = await api.get('/tanks/analytics/consumo-promedio/', {
          params: { tanque_id: tanqueId, dias },
        });

        const datos = response.data;

        // Validar la respuesta
        if (datos && datos.promedio_consumo_diario !== undefined) {
          setPromedio(datos.promedio_consumo_diario); // Actualiza el promedio
        } else {
          setPromedio(null); // No hay datos válidos
        }
      } catch (err) {
        console.error('Error fetching consumo promedio:', err);
        setError('No se pudo cargar el consumo promedio');
      } finally {
        setLoading(false); // Finaliza la carga en cualquier caso
      }
    };

    fetchConsumoPromedio();
  }, [tanqueId, dias]);

  return (
    <div className="rounded-[20px] bg-[#1a1d21] p-4 shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329] border border-[#232529]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-400">Consumo Promedio</h3>
        <DropletIcon className="text-blue-500" size={20} />
      </div>

      {loading ? (
        <LoaderAnalysis /> // Muestra el Loader mientras está cargando
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : promedio !== null ? (
        promedio > 0 ? (
          <div className="text-xl font-bold text-white">
            {`${promedio.toFixed(2)} L/día`}
          </div>
        ) : (
          <div className="text-gray-400">Sin consumo registrado</div>
        )
      ) : (
        <div className="text-gray-400">Sin datos disponibles</div>
      )}
    </div>
  );
};

export default AverageConsumption;
