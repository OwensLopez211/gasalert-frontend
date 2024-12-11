import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, AlertTriangle, ArrowDown, ArrowUp, AlertCircle, CheckCircle2 } from 'lucide-react';

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
        return <AlertTriangle className="w-4 h-4" />;
      case 'BAJO':
        return <ArrowDown className="w-4 h-4" />;
      case 'MEDIO':
        return <AlertCircle className="w-4 h-4" />;
      case 'ALTO':
        return <ArrowUp className="w-4 h-4" />;
      case 'LIMITE':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getAlertColor = (tipo, estado) => {
    if (estado === 'RESUELTA') {
      return {
        container: 'bg-gray-500/5 hover:bg-gray-500/10 border border-gray-500/10',
        text: 'text-gray-400',
        icon: 'bg-gray-500/10 text-gray-400',
        badge: 'bg-gray-500/10 text-gray-400'
      };
    }
    
    const colors = {
      CRITICO: {
        container: 'bg-red-500/5 hover:bg-red-500/10 border border-red-500/10',
        text: 'text-red-400',
        icon: 'bg-red-500/10 text-red-400',
        badge: 'bg-red-500/10 text-red-400'
      },
      BAJO: {
        container: 'bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-500/10',
        text: 'text-yellow-400',
        icon: 'bg-yellow-500/10 text-yellow-400',
        badge: 'bg-yellow-500/10 text-yellow-400'
      },
      MEDIO: {
        container: 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10',
        text: 'text-blue-400',
        icon: 'bg-blue-500/10 text-blue-400',
        badge: 'bg-blue-500/10 text-blue-400'
      },
      ALTO: {
        container: 'bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/10',
        text: 'text-orange-400',
        icon: 'bg-orange-500/10 text-orange-400',
        badge: 'bg-orange-500/10 text-orange-400'
      },
      LIMITE: {
        container: 'bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/10',
        text: 'text-purple-400',
        icon: 'bg-purple-500/10 text-purple-400',
        badge: 'bg-purple-500/10 text-purple-400'
      }
    };

    return colors[tipo] || {
      container: 'bg-green-500/5 hover:bg-green-500/10 border border-green-500/10',
      text: 'text-green-400',
      icon: 'bg-green-500/10 text-green-400',
      badge: 'bg-green-500/10 text-green-400'
    };
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
      <div className="bg-[#1a1d21]/70 backdrop-blur-xl rounded-3xl border border-white/[0.05] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Bell className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Alertas Recientes
          </h3>
        </div>
        <div className="space-y-3">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 rounded-xl bg-white/[0.02] border border-white/[0.05]"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1a1d21]/70 backdrop-blur-xl rounded-3xl border border-white/[0.05] p-6">
        <div className="flex items-center justify-center h-40">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1d21]/70 backdrop-blur-xl rounded-3xl border border-white/[0.05] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Bell className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">
          Alertas Recientes
        </h3>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const tipoUmbral = alert.tipo_umbral || alert.configuracion_umbral?.tipo;
            const colors = getAlertColor(tipoUmbral, alert.estado);
            
            return (
              <div
                key={alert.id || Math.random()}
                className={`rounded-xl p-4 transition-all duration-300 ${colors.container}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colors.icon} flex-shrink-0`}>
                    {getAlertIcon(tipoUmbral)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`font-medium truncate ${colors.text}`}>
                          Tanque #{alert.tanque}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-lg ${colors.badge}`}>
                          {tipoUmbral || 'Sin tipo'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {alert.estado === 'RESUELTA' ? (
                          <span className="text-green-400">Resuelta</span>
                        ) : (
                          formatTime(alert.fecha_generacion)
                        )}
                      </span>
                    </div>
                    
                    <div className="mt-1 text-sm text-gray-400">
                      Nivel actual: {formatNumber(alert.nivel_detectado)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-gray-400 font-medium">No hay alertas recientes</p>
        </div>
      )}
    </div>
  );
};

export default RecentAlerts;