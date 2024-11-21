import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ThresholdConfig from "./ThresholdConfig";

const TankStatusDisplay = () => {
  const { user } = useContext(AuthContext);
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);
  const [selectedTankId, setSelectedTankId] = useState(null);

  const estacionId = user?.estaciones?.[0]?.id;

  const api = useMemo(() => axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  }), []);

  const fetchTanks = useCallback(async () => {
    if (!estacionId) {
      setError("No se encontró una estación asociada.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/tanks?estacion_id=${estacionId}`);
      setTanks(response.data);
      setLoading(false);
    } catch (err) {
      setError("No se pudieron cargar los tanques");
      setLoading(false);
    }
  }, [estacionId, api]);

  const updateTankData = useCallback((tankId, lectura) => {
    setTanks((prevTanks) =>
      prevTanks.map((tank) =>
        tank.id === tankId
          ? { ...tank, ultima_lectura: lectura }
          : tank
      )
    );
  }, []);

  useEffect(() => {
    fetchTanks();
  }, [fetchTanks]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8001/ws/tank_status/");

    socket.onopen = () => {
      console.log("Conexión WebSocket establecida");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "tank_reading" || !data.type) {
        updateTankData(data.tank_id, data.ultima_lectura);
      }
    };

    socket.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    socket.onclose = () => {
      console.log("Conexión WebSocket cerrada");
    };

    return () => socket.close();
  }, [updateTankData]);

  const formatNumber = (number) => {
    return number.toLocaleString('es-ES', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      useGrouping: true
    });
  };

  const neumorphicClass = `
    rounded-[24px] 
    bg-[#1a1d21]
    shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]
    border border-[#232529]
  `;

  const neumorphicButtonClass = `
    bg-gradient-to-br from-[#3B82F6] to-[#2563EB]
    text-white text-xs md:text-sm font-medium
    px-4 py-2 rounded-xl
    shadow-[4px_4px_8px_#151719,-4px_-4px_8px_#1f2329]
    hover:shadow-[6px_6px_12px_#151719,-6px_-6px_12px_#1f2329]
    hover:from-[#2563EB] hover:to-[#1D4ED8]
    transition-all duration-300
    transform hover:scale-[1.02]
  `;

  const getColor = (nivel) => {
    if (nivel > 75) return {
      base: "#10B981",
      light: "#34D399",
      dark: "#059669"
    };
    if (nivel > 40) return {
      base: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706"
    };
    return {
      base: "#EF4444",
      light: "#F87171",
      dark: "#DC2626"
    };
  };

  if (loading) return <div className="text-white">Cargando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className={`${neumorphicClass} p-6 space-y-6`}>
      <h2 className="text-white text-xl font-bold">
        Estado Actual de los Tanques
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tanks.map((tank) => {
          const nivel = tank.ultima_lectura
            ? (tank.ultima_lectura.volumen / tank.capacidad_total) * 100
            : 0;
          const colors = getColor(nivel);

          return (
            <div
              key={tank.id}
              className={`
                flex flex-col
                p-4
                rounded-2xl
                bg-[#1f2227]
                shadow-[8px_8px_16px_#151719,-8px_-8px_16px_#292d35]
                border border-[#232529]/50
                transform hover:scale-[1.02]
                transition-all duration-300
              `}
            >
              {/* Header con Nombre del Tanque */}
              <div className="mb-4 text-center">
                <h3 className="text-white font-semibold text-lg">
                  {tank.nombre}
                </h3>
              </div>

              {/* Contenedor del Indicador */}
              <div className="flex justify-center mb-4">
                <div className="relative inline-block">
                  <div
                    className="relative bg-[#292d35] rounded-2xl overflow-hidden mx-auto"
                    style={{
                      height: "120px",
                      width: "40px"
                    }}
                  >
                    {nivel === 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-gray-500 font-semibold transform -rotate-90 whitespace-nowrap text-sm tracking-wider">
                          VACÍO
                        </div>
                      </div>
                    ) : (
                        <div
                        className="liquid-container"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: `${nivel}%`,
                          background: `linear-gradient(to bottom, ${colors.light}, ${colors.base})`,
                          transition: 'height 0.8s ease-in-out',
                        }}
                      >
                        <div className="wave-top">
                          <div 
                            className="wave-curve"
                            style={{ color: colors.base }}
                          />
                          <div 
                            className="wave-curve wave2"
                            style={{ color: colors.base }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Información de Nivel y Volumen */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="text-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    {nivel.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 text-sm">
                    {tank.ultima_lectura 
                      ? `${formatNumber(tank.ultima_lectura.volumen)} L`
                      : "0,0 L"}
                  </span>
                </div>
                <div className="text-gray-400 text-xs">
                  Capacidad: {formatNumber(tank.capacidad_total)} L
                </div>
              </div>

              {/* Botón de Configuración */}
              <button
                onClick={() => {
                    setSelectedTankId(tank.id);
                    setShowThresholdConfig(true);
                  }}                  
                className={`
                  mt-auto
                  w-full
                  py-2
                  rounded-xl
                  font-medium
                  text-sm
                  transition-all
                  duration-300
                  bg-gradient-to-br from-[#3B82F6] to-[#2563EB] 
                  text-white
                  shadow-[4px_4px_8px_#151719,-4px_-4px_8px_#1f2329]
                  hover:shadow-[6px_6px_12px_#151719,-6px_-6px_12px_#1f2329]
                  hover:from-[#2563EB] hover:to-[#1D4ED8]
                `}
              >
                Configurar
              </button>
            </div>
          );
        })}
      </div>

      {showThresholdConfig && selectedTankId && (
        <ThresholdConfig
          tankId={selectedTankId}
          onClose={() => {
            setSelectedTankId(null);
            setShowThresholdConfig(false);
          }}
        />
      )}

    <style jsx>{`
        .liquid-container {
            overflow: hidden;
            border-radius: 16px;
            position: relative;
        }

        .wave-top {
            position: absolute;
            top: -2px; /* Ajustado para que se vea mejor la transición */
            left: 0;
            right: 0;
            height: 10px;
            width: 100%;
            overflow: hidden;
        }

        .wave-curve {
            position: absolute;
            left: 0;
            top: 0;
            width: 400%; /* Aumentado para tener más espacio para la animación */
            height: 100%;
            background: inherit;
            transform-origin: 0 50%;
            animation: waveAnimation 8s linear infinite;
        }

        .wave-curve::before,
        .wave-curve::after {
            content: "";
            position: absolute;
            width: 25%; /* 100% / 4 */
            height: 100%;
            top: 0;
            background-image: radial-gradient(circle at 50% 0%, transparent 25%, currentColor 25%);
            background-size: 50px 20px;
            background-repeat: repeat-x;
            animation: bobbing 3s ease-in-out infinite alternate;
        }

        .wave-curve::after {
            left: 25%;
            background-position: 25px 0;
            opacity: 0.7;
            animation-delay: -1.5s;
        }

        .wave2 {
            top: 2px;
            animation: waveAnimation 10s linear infinite;
            opacity: 0.5;
        }

        .wave2::before,
        .wave2::after {
            animation-delay: -2s;
            animation-duration: 4s;
        }

        @keyframes waveAnimation {
            0% {
            transform: translateX(0);
            }
            100% {
            transform: translateX(-50%);
            }
        }

        @keyframes bobbing {
            0%, 100% {
            transform: translateY(-1px);
            }
            50% {
            transform: translateY(1px);
            }
        }
    `}</style>
    </div>
  );
};

export default TankStatusDisplay;