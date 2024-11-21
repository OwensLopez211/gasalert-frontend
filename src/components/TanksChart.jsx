import React, { useEffect, useState, useMemo, useContext } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useCallback } from "react";


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
        baseURL: "http://localhost:8000/api",
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
          height: '100%',
          borderRadius: 24,  // Esto agrega los bordes redondos
          spacing: [20, 20, 20, 20], // Ajusta el espacio interno para que el contenido no toque los bordes
        },
      title: {
        text: "Niveles Históricos de Tanques",
        align: "left",
        style: { 
          color: "#FFFFFF",
          fontSize: '18px',
          fontWeight: '600'
        },
        margin: 20
      },
      xAxis: {
        type: "datetime",
        labels: { 
          style: { 
            color: "rgba(255,255,255,0.7)",
            fontSize: '12px'
          },
          formatter: function() {
            return Highcharts.dateFormat('%H:%M', this.value);
          }
        },
        lineColor: 'rgba(255,255,255,0.1)',
        tickColor: 'rgba(255,255,255,0.1)',
        gridLineColor: 'rgba(255,255,255,0.05)',
        crosshair: {
          color: 'rgba(255,255,255,0.1)',
          dashStyle: 'dash'
        }
      },
      yAxis: {
        title: { 
          text: "Nivel (%)", 
          style: { 
            color: "rgba(255,255,255,0.7)",
            fontSize: '12px'
          }
        },
        labels: { 
          style: { 
            color: "rgba(255,255,255,0.7)",
            fontSize: '12px'
          }
        },
        max: 100,
        min: 0,
        gridLineColor: 'rgba(255,255,255,0.05)',
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
        borderRadius: 16,
        shadow: {
          offsetX: 1,
          offsetY: 2,
          width: 2,
          color: 'rgba(0,0,0,0.05)'
        },
        style: { 
          color: "#FFFFFF",
          fontSize: '12px'
        },
        formatter: function() {
          const fecha = new Date(this.x);
          const header = `<div style="font-size: 13px; font-weight: 600; margin-bottom: 8px">
            ${Highcharts.dateFormat('%A, %e %b, %H:%M', fecha)}</div>`;
          const points = this.points.map(point => 
            `<div style="display: flex; align-items: center; gap: 5px; padding: 4px 0">
              <span style="color:${point.color}; font-size: 16px">●</span>
              <span style="flex: 1">${point.series.name}:</span>
              <span style="font-weight: 600">${point.y.toFixed(1)}%</span>
            </div>`
          ).join('');
          return header + points;
        },
        useHTML: true
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: { 
          color: "rgba(255,255,255,0.7)",
          fontSize: '12px',
          fontWeight: '500'
        },
        itemHoverStyle: { 
          color: "#FFFFFF"
        },
        itemDistance: 20,
        symbolRadius: 6,
        symbolHeight: 12,
        symbolWidth: 12
      },
      series: series.map(s => ({
        ...s,
        fillOpacity: 0.1
      })),
      plotOptions: {
        areaspline: {
          fillOpacity: 0.1,
          lineWidth: 2,
          marker: {
            enabled: false,
            radius: 4,
            fillColor: '#FFFFFF',
            states: {
              hover: {
                enabled: true,
                radius: 6
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
      <div className={`
        rounded-[24px] bg-[#1a1d21] p-8
        shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]
        min-h-[400px] flex items-center justify-center
      `}>
        <div className="relative flex items-center justify-center">
          <div className="absolute animate-ping inline-flex h-12 w-12 rounded-full bg-blue-500 opacity-20"></div>
          <div className="relative inline-flex rounded-full h-6 w-6 bg-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`
        rounded-[24px] bg-[#1a1d21] p-8
        shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]
        min-h-[400px] flex items-center justify-center
      `}>
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <div className="text-red-400 font-medium text-lg">Error: {error}</div>
          <p className="text-gray-400 mt-2 text-sm">
            No se pudieron cargar los datos del gráfico
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={chartOptions}
        containerProps={{ 
          style: { 
            height: '100%',
            width: '100%',
            borderRadius: '24px', // También agregamos bordes redondos al contenedor
            overflow: 'hidden'    // Asegura que el contenido respete los bordes redondos
          } 
        }}
      />
    </div>
  );
};

export default TankHistoricalChart;
