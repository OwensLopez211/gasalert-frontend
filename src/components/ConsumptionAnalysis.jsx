import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL;

// Subcomponente para métricas clave
const MetricCard = ({ title, value, description, icon: Icon, iconColor }) => (
  <div className="bg-[#1a1d21] p-4 rounded-xl border border-[#232529]">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-400">{title}</h3>
      {Icon && <Icon className={iconColor} size={20} />}
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    {description && <div className="text-sm text-gray-400">{description}</div>}
  </div>
);

const ConsumptionAnalysis = ({ tanqueId, range = '7d' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(
          `${API_URL}/tanks/analytics/${tanqueId}/tendencia_consumo/?range=${range}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error('Error al cargar los datos del servidor.');
        }

        const result = await response.json();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError('Error al cargar los datos de tendencia.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [tanqueId, range]);

  // Submuestreo: Filtra puntos para mejorar el rendimiento
  const simplifiedData = useMemo(() => {
    if (!data?.datos_tendencia) return [];
    const step = Math.ceil(data.datos_tendencia.length / 500); // Máximo de 500 puntos
    return data.datos_tendencia.filter((_, index) => index % step === 0);
  }, [data?.datos_tendencia]);

  // Manejo de estados de carga y error
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-gray-400">Cargando análisis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-500/10">
        {error}
      </div>
    );
  }

  if (!data || !data.estadisticas) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-500/10">
        No hay datos suficientes para mostrar el análisis.
      </div>
    );
  }

  const tendenciaColor =
    data.tendencia_general?.direccion === 'AUMENTANDO' ? 'text-red-500' : 'text-green-500';

  const TendenciaIcon =
    data.tendencia_general?.direccion === 'AUMENTANDO' ? TrendingUp : TrendingDown;

  return (
    <div className="space-y-6">
      {/* Resumen de Tendencias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Tendencia General"
          value={`${data.estadisticas.consumo_promedio?.toFixed(2) || 0} L/h`}
          description={
            data.tendencia_general?.direccion
              ? `${data.tendencia_general.direccion.toLowerCase()} (${(data.tendencia_general.confianza * 100 || 0).toFixed(1)}% confianza)`
              : 'Sin datos'
          }
          icon={TendenciaIcon}
          iconColor={tendenciaColor}
        />
        <MetricCard
          title="Variabilidad"
          value={`${data.estadisticas.coeficiente_variacion || 0}%`}
          description="Coeficiente de variación"
        />
        <MetricCard
          title="Anomalías"
          value={data.anomalias?.length || 0}
          description="Consumos anormales detectados"
          icon={AlertTriangle}
          iconColor="text-yellow-500"
        />
      </div>
            {/* Gráfico Principal */}
            <div className="bg-[#1a1d21] p-4 rounded-xl border border-[#232529]">
        <h3 className="text-white text-lg font-semibold mb-4">Tendencia de Consumo</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simplifiedData}>
              <defs>
                <linearGradient id="colorConsumo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3137" />
              <XAxis
                dataKey="fecha"
                stroke="#9ca3af"
                tickFormatter={(fecha) => format(parseISO(fecha), 'dd-MM-yyyy HH:mm')}
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1d21',
                  border: '1px solid #232529',
                  borderRadius: '8px',
                }}
                formatter={(value) => [`${value.toFixed(2)} L`, 'Consumo']}
              />
              <Area
                type="monotone"
                dataKey="consumo"
                stroke="#3b82f6"
                fill="url(#colorConsumo)"
              />
              {data.anomalias?.slice(0, 50).map((anomalia, index) => (
                <ReferenceLine
                  key={index}
                  x={anomalia.fecha}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionAnalysis;
