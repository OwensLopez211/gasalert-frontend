import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const RecentAlerts = ({ limit = 3, className = '' }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/alerts/alertas/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            estado: 'ACTIVA,NOTIFICADA,RESUELTA', // Ahora incluye las alertas resueltas
            limit: limit,
          },
        });

        setAlerts(response.data.slice(0, limit));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError('Error al cargar las alertas');
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [limit]);

  const getAlertIcon = (tipo) => {
    switch (tipo) {
      case 'CRITICO':
        return '🔴';
      case 'BAJO':
        return '⚠️';
      case 'MEDIO':
        return '⚡';
      case 'ALTO':
        return '⬆️';
      case 'LIMITE':
        return '🔝';
      default:
        return '✅';
    }
  };

  const getAlertColor = (tipo, estado) => {
    if (estado === 'RESUELTA') {
      return 'bg-gray-500/10 text-gray-400'; // Color para alertas resueltas
    }
    switch (tipo) {
      case 'CRITICO':
        return 'bg-red-500/10 text-red-400';
      case 'BAJO':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'MEDIO':
        return 'bg-blue-500/10 text-blue-400';
      case 'ALTO':
        return 'bg-orange-500/10 text-orange-400';
      case 'LIMITE':
        return 'bg-purple-500/10 text-purple-400';
      default:
        return 'bg-green-500/10 text-green-400';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const now = new Date();
    const alertDate = new Date(dateString);
    const diffMinutes = Math.floor((now - alertDate) / (1000 * 60));

    if (diffMinutes < 60) {
      return `Hace ${diffMinutes} min`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `Hace ${hours}h`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `Hace ${days}d`;
    }
  };

  const formatNumber = (number) => {
    if (number === null || number === undefined) return '-';
    return Number(number).toFixed(1);
  };

  if (loading) {
    return (
      <div className="animate-pulse p-6 bg-[#1a1d21] rounded-[39px] shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]">
        <div className="h-6 w-48 bg-gray-700 rounded mb-4"></div>
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-700 rounded mb-3"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-[#1a1d21] rounded-[39px] shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-[#1a1d21] rounded-[39px] shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329] ${className}`}>
      <h3 className="text-white text-base md:text-lg font-semibold mb-4">
        Alertas Recientes
      </h3>
      {alerts.length > 0 ? (
        <ul className="text-gray-300 text-sm space-y-3">
          {alerts.map((alert) => {
            const tipoUmbral = alert.tipo_umbral || alert.configuracion_umbral?.tipo;
            return (
              <li
                key={alert.id || Math.random()}
                className={`p-3 rounded-xl transition-all duration-300 ${getAlertColor(tipoUmbral, alert.estado)}`}
              >
                <div className="flex items-center gap-2">
                  <span>{getAlertIcon(tipoUmbral)}</span>
                  <div className="flex-1">
                    <p className="font-medium flex items-center gap-2">
                      <span>Tanque #{alert.tanque}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50">
                        {tipoUmbral || 'Sin tipo'}
                      </span>
                    </p>
                    <div className="text-xs mt-1">
                      <span className="opacity-75">
                        Nivel actual: {formatNumber(alert.nivel_detectado)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs opacity-75">
                    {alert.estado === 'RESUELTA' ? (
                      <span className="text-green-500">Resuelta</span>
                    ) : (
                      formatTime(alert.fecha_generacion)
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-400 text-center p-4">No hay alertas recientes</p>
      )}
    </div>
  );
};

export default RecentAlerts;
