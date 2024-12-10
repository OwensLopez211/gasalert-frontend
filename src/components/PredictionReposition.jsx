import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarIcon } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL;

const PredictionReposition = ({ tanqueId }) => {
  const [capacidadTotal, setCapacidadTotal] = useState(null);
  const [nivelActual, setNivelActual] = useState(null);
  const [promedioDiario, setPromedioDiario] = useState(null);
  const [diasRestantes, setDiasRestantes] = useState(null);
  const [fechaReposicion, setFechaReposicion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTankData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('access_token');
        const api = axios.create({
          baseURL: `${API_URL}`,
          headers: { Authorization: `Bearer ${token}` },
        });

        const response = await api.get(`/tanks/analytics/${tanqueId}/tank_detail_analysis/`);
        console.log("Datos recibidos del backend:", response.data);

        const { capacidad_total, nivel_actual, promedio_diario } = response.data;

        setCapacidadTotal(capacidad_total);
        setNivelActual(nivel_actual);
        setPromedioDiario(promedio_diario);

        // Calcula los días restantes
        if (nivel_actual > 0 && promedio_diario > 0) {
          const dias = nivel_actual / promedio_diario;
          setDiasRestantes(dias);

          // Calcula la fecha estimada de reposición
          const fecha = new Date();
          fecha.setDate(fecha.getDate() + Math.floor(dias));
          setFechaReposicion(fecha.toISOString().split('T')[0]); // Solo la fecha
        } else {
          setDiasRestantes(null);
          setFechaReposicion(null);
        }
      } catch (err) {
        console.error('Error fetching tank data:', err);
        setError('No se pudieron calcular las predicciones de reposición');
      } finally {
        setLoading(false);
      }
    };

    fetchTankData();
  }, [tanqueId]);

  return (
    <div className="rounded-[20px] bg-[#1a1d21] p-4 shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329] border border-[#232529]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-400">Predicción de Reposición</h3>
        <CalendarIcon className="text-blue-500" size={20} />
      </div>
  
      {loading ? (
        <div className="text-gray-400">Cargando...</div>
      ) : error ? (
        <div className="text-red-500">{`Error: ${error}. Por favor, inténtalo nuevamente.`}</div>
      ) : promedioDiario === 0 ? (
        <div className="text-gray-400">No se puede calcular la predicción debido a consumo inexistente.</div>
      ) : (
        <div>
          <div className="text-xl font-bold text-white">
            {diasRestantes !== null ? (
              <>
                {diasRestantes.toFixed(1)} días restantes
                <br />
                Reposición estimada: {fechaReposicion}
              </>
            ) : (
              'No se pudo calcular la predicción'
            )}
          </div>
        </div>
      )}
    </div>
  );
  
};

export default PredictionReposition;
