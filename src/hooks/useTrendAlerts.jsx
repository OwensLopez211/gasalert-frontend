import { useState, useEffect } from 'react';
import axios from 'axios';
import TrendDetectionService from '../services/TrendDetectionService';

const API_BASE_URL = 'http://localhost:8000/api';

const useTrendAlerts = (tankId, timeRange = '24h') => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!tankId || tankId === 'all') {
        setAlerts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        // Usar la URL base correcta
        const response = await axios.get(`${API_BASE_URL}/tanks/analytics/nivel_historico/`, {
          params: {
            tanque_id: tankId,
            range: timeRange
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Log para depuración
        console.log('API Response:', response.data);

        if (response.data) {
          // Analizar tendencias
          const detectedAlerts = TrendDetectionService.analyzeAllTrends({
            readings: response.data.datos || [],
            refills: response.data.reposiciones || []
          });

          // Formatear alertas
          const formattedAlerts = detectedAlerts.map(alert => ({
            mensaje: alert.mensaje,
            tiempo: formatTimeAgo(new Date(alert.fecha)),
            subtexto: alert.severidad === 'ALTA' ? 'Requiere atención inmediata' : undefined,
            severidad: alert.severidad
          }));

          setAlerts(formattedAlerts);
        }
      } catch (err) {
        console.error('Error fetching tank data:', err.response || err);
        setError(err.response?.data?.detail || 'Error al cargar los datos del tanque');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tankId, timeRange]);

  return { alerts, loading, error };
};

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} atrás`;
    }
  }
  
  return 'Hace un momento';
};

export default useTrendAlerts;