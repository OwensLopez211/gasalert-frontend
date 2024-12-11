import React, { useEffect, useState, useMemo, useContext } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useCallback } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const TankHistoricalChart = ({ range = "24h" }) => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({});
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleTanks, setVisibleTanks] = useState([]);

  const estacionId = user?.estaciones?.[0]?.id;

  const predefinedColors = useMemo(
    () => [
      "#3B82F6", // Azul
      "#10B981", // Verde
      "#F59E0B", // Naranja
      "#EF4444", // Rojo
      "#8B5CF6", // Morado
      "#EC4899", // Rosa
      "#6366F1", // Indigo
      "#F97316", // Ámbar
      "#14B8A6", // Teal
      "#4ADE80", // Lima
    ],
    []
  );
  
  const generateTankConfig = useCallback(
    (tanks) => {
      const config = {};
      tanks.forEach((tank, index) => {
        config[tank.id] = {
          name: tank.nombre,
          color: predefinedColors[index % predefinedColors.length],
        };
      });
      return config;
    },
    [predefinedColors] // Dependencia estable
  );
  
  

  const api = useMemo(
    () =>
      axios.create({
        baseURL: `${API_URL}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    []
  );

const [tankConfig, setTankConfig] = useState({}); // Estado para el config dinámico

useEffect(() => {
  const fetchTanks = async () => {
    if (!estacionId) {
      setError("No se encontró una estación asociada.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/tanks?estacion_id=${estacionId}`);
      const tanks = response.data;

      console.log("Tanks fetched:", tanks);

      const config = generateTankConfig(tanks);
      console.log("Generated Tank Config:", config);
      setTankConfig(config);

      const tankIds = tanks.map((tank) => tank.id);
      setVisibleTanks(tankIds);
      setTanks(tanks);
    } catch (err) {
      console.error("Error fetching tanks:", err);
      setError("No se pudieron cargar los tanques.");
    }
  };

  fetchTanks();
}, [estacionId, api, generateTankConfig]); // Dependencias correctas
  

  useEffect(() => {
    const fetchTanksData = async () => {
      if (!tanks.length) return;

      try {
        setLoading(true);
        const promises = tanks.map((tank) =>
          api.get(`/tanks/analytics/nivel_historico/`, {
            params: {
              tanque_id: tank.id,
              range: range,
              interval: range.includes("d") ? "day" : "hour",
            },
          })
        );

        const responses = await Promise.all(promises);
        const newData = {};
        responses.forEach((response, index) => {
          const tankId = tanks[index].id;
          newData[tankId] = {
            ...response.data,
            datos: response.data.datos.map((point) => ({
              ...point,
              nivel: point.nivel_promedio,
            })),
          };
        });

        setData(newData);
      } catch (err) {
        console.error("Error fetching tanks data:", err);
        setError("Error al cargar los datos de los tanques");
      } finally {
        setLoading(false);
      }
    };

    fetchTanksData();
  }, [tanks, range, api]);

  const chartOptions = useMemo(() => {
    const series = Object.keys(tankConfig)
      .filter((tankId) => visibleTanks.includes(Number(tankId)))
      .map((tankId) => ({
        name: tankConfig[tankId]?.name || `Tanque ${tankId}`,
        data: (data[tankId]?.datos || []).map((d) => {
          const fecha = new Date(d.fecha);
          const fechaLocal = new Date(fecha.getTime() - (fecha.getTimezoneOffset() * 60000));
          return {
            x: fechaLocal.getTime(),
            y: d.nivel,
          };
        }),
        color: tankConfig[tankId]?.color || "#374151",
      }));
  
      return {
        chart: {
          type: "areaspline",
          backgroundColor: '#1a1d21',
          style: { fontFamily: 'Inter, sans-serif' },
          height: 520, // Aumentado a 320px para mejor visualización
          borderRadius: 24,
          spacing: [20, 25, 20, 25], // Aumentado el espaciado lateral
          animation: {
            duration: 1000
          }
        },
        title: {
          text: undefined
        },
        xAxis: {
          type: "datetime",
          labels: { 
            style: { 
              color: "rgba(255,255,255,0.5)",
              fontSize: '11px'
            },
            formatter: function() {
              return Highcharts.dateFormat('%H:%M', this.value);
            },
            y: 25 // Alejamos un poco las etiquetas del eje
          },
          lineColor: 'rgba(255,255,255,0.1)',
          tickColor: 'rgba(255,255,255,0.1)',
          gridLineColor: 'transparent',
          crosshair: {
            color: 'rgba(255,255,255,0.2)',
            dashStyle: 'dot',
            width: 1
          },
          tickLength: 8 // Marcas más largas en el eje
        },
        yAxis: {
          title: { 
            text: "Nivel (%)", 
            style: { 
              color: "rgba(255,255,255,0.5)",
              fontSize: '11px'
            },
            x: -15 // Alejamos un poco el título del eje
          },
          labels: { 
            style: { 
              color: "rgba(255,255,255,0.5)",
              fontSize: '11px'
            },
            formatter: function() {
              return this.value + '%';
            },
            x: -10 // Alejamos un poco las etiquetas del eje
          },
          max: 100,
          min: 0,
          tickInterval: 20,
          gridLineColor: 'rgba(255,255,255,0.05)',
          gridLineDashStyle: 'dot',
          plotBands: [{
            from: 0,
            to: 100,
            color: 'rgba(255,255,255,0.02)'
          }]
        },
        tooltip: {
          shared: true,
          backgroundColor: "rgba(26, 29, 33, 0.95)",
          borderWidth: 0,
          borderRadius: 12,
          shadow: {
            offsetX: 1,
            offsetY: 2,
            width: 2,
            color: 'rgba(0,0,0,0.1)'
          },
          style: { 
            color: "#FFFFFF",
            fontSize: '11px'
          },
          formatter: function() {
            const fecha = new Date(this.x);
            const header = `<div style="font-size: 12px; font-weight: 600; margin-bottom: 6px">
              ${Highcharts.dateFormat('%H:%M', fecha)}</div>`;
            const points = this.points.map(point => 
              `<div style="display: flex; align-items: center; gap: 4px; padding: 3px 0">
                <span style="color:${point.color}; font-size: 14px">●</span>
                <span style="flex: 1">${point.series.name}:</span>
                <span style="font-weight: 600">${point.y.toFixed(1)}%</span>
              </div>`
            ).join('');
            return header + points;
          },
          useHTML: true,
          padding: 10
        },
        legend: {
          enabled: true,
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'horizontal',
          itemStyle: { 
            color: "rgba(255,255,255,0.5)",
            fontSize: '11px',
            fontWeight: '500'
          },
          itemHoverStyle: { 
            color: "#FFFFFF"
          },
          itemDistance: 15,
          symbolRadius: 4,
          symbolHeight: 10,
          symbolWidth: 10,
          padding: 15,
          margin: 15 // Más espacio para la leyenda
        },
        series: series.map(s => ({
          ...s,
          fillOpacity: 0.08,
          lineWidth: 2,
          marker: {
            radius: 4
          }
        })),
        plotOptions: {
          areaspline: {
            fillOpacity: 0.08,
            marker: {
              enabled: false,
              states: {
                hover: {
                  enabled: true,
                  radius: 4,
                  lineWidth: 2
                }
              }
            },
            states: {
              hover: {
                lineWidth: 3,
                halo: {
                  size: 0
                }
              }
            }
          }
        },
        credits: {
          enabled: false
        },
        time: {
          timezone: 'America/Santiago'
        }
      };
  }, [data, tankConfig, visibleTanks]);

  if (loading) {
    return (
      <div className="rounded-[24px] bg-[#1a1d21] p-6 h-[520px] w-full
                    shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]
                    flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute animate-ping inline-flex h-8 w-8 rounded-full bg-blue-500 opacity-20"></div>
          <div className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[24px] bg-[#1a1d21] p-6 h-[520px] w-full
                    shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]
                    flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <div className="text-red-400 font-medium text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[520px] w-full rounded-[24px] bg-[#1a1d21] overflow-hidden
                    shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={chartOptions}
        containerProps={{ 
          style: { 
            height: '100%',
            width: '100%',
            borderRadius: '24px'
          } 
        }}
      />
    </div>
  );
};

export default TankHistoricalChart;