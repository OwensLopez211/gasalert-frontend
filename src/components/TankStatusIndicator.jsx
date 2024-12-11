import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ThresholdConfig from "./ThresholdConfig";
import FuelAnalysisPage from "../pages/FuelAnalysisPage";
import { useNavigate } from 'react-router-dom';
import Loader from "./Loader";
import { Settings, Activity, Droplet, } from 'lucide-react';
import './TankIndicator.css';

const API_URL = process.env.REACT_APP_API_URL;
const WS_URL = process.env.REACT_APP_WS_URL;

const TankStatusDisplay = () => {
  const { user } = useContext(AuthContext);
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);
  const [selectedTankId, setSelectedTankId] = useState(null);
  const [showTankAnalysis, setShowTankAnalysis] = useState(false);
  const navigate = useNavigate();

  const estacionId = user?.estaciones?.[0]?.id;
  
  const handleAnalysis = (tankId) => {
    navigate(`/analysis/${tankId}`, { 
      state: {
        tankId,   // Pasar el ID del tanque seleccionado
        range: "7d", // Configurar el rango predeterminado o dinámico si lo tienes
      },
    });  
  };
  


  const api = useMemo(() => axios.create({
    baseURL: `${API_URL}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    withCredentials: true // Añadir esto
  }), []);

  const fetchTanks = useCallback(async () => {
    if (!estacionId) {
      setError("No se encontró una estación asociada.");
      setLoading(true);
      return;
    }

    try {
      const response = await api.get(`/tanks?estacion_id=${estacionId}`);
      setTanks(response.data);
      setLoading(false);
    } catch (err) {
      setError("No se pudieron cargar los tanques");
      setLoading(true);
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
    let ws;
    const connectWebSocket = () => {
      // Usar consistentemente el puerto 8001 para WebSocket
      ws = new WebSocket(`${WS_URL}/tank_status/`);
      
      // Agregar el token de autorización en la conexión WebSocket
      ws.onopen = () => {
        console.log("WebSocket conectado");
        // Enviar token de autenticación
        ws.send(JSON.stringify({
          type: 'authenticate',
          token: localStorage.getItem('access_token')
        }));
      };
  
      ws.onmessage = (event) => {
        /* console.log("Datos recibidos:", event.data); */   // en caso de querer ver el log de los datos recibidos
        try {
          const data = JSON.parse(event.data);
          if (data.tank_id && data.ultima_lectura) {
            updateTankData(data.tank_id, data.ultima_lectura);
          }
        } catch (error) {
          console.error("Error procesando mensaje:", error);
        }
      };
  
      ws.onerror = (error) => {
        console.error("Error en WebSocket:", error);
      };
  
      ws.onclose = (event) => {
        console.log("WebSocket desconectado", event.code, event.reason);
        // Solo intentar reconectar si no fue un cierre limpio
        if (event.code !== 1000) {
          console.log("Intentando reconectar...");
          setTimeout(connectWebSocket, 3000);
        }
      };
    };
  
    connectWebSocket();
  
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [updateTankData]);

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
      dark: "#059669",
      bg: "from-green-500/10 to-green-500/5",
      border: "border-green-500/20",
      text: "text-green-400"
    };
    if (nivel > 40) return {
      base: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
      bg: "from-yellow-500/10 to-yellow-500/5",
      border: "border-yellow-500/20",
      text: "text-yellow-400"
    };
    return {
      base: "#EF4444",
      light: "#F87171",
      dark: "#DC2626",
      bg: "from-red-500/10 to-red-500/5",
      border: "border-red-500/20",
      text: "text-red-400"
    };
  };

  const formatNumber = (number, maxDecimals = 1) => {
    return number.toLocaleString('es-ES', {
      minimumFractionDigits: 1,
      maximumFractionDigits: maxDecimals,
      useGrouping: true
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {tanks.map((tank) => {
        const nivel = tank.ultima_lectura
          ? (tank.ultima_lectura.volumen / tank.capacidad_total) * 100
          : 0;
        const colors = getColor(nivel);

        return (
          <div
            key={tank.id}
            className="bg-[#1f2227] rounded-2xl border border-[#2d3137]/30 p-5 flex flex-col min-h-[480px]"
          >
            {/* Cabecera del Tanque */}
            <div className="flex flex-col space-y-1 mb-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {tank.nombre}
                  </h3>
                  <span className="text-sm text-gray-500">(Ficticio)</span>
                </div>
                <span className={`${colors.text} font-semibold text-lg tabular-nums`}>
                  {formatNumber(nivel)}%
                </span>
              </div>
            </div>

            {/* Indicador de Nivel */}
            <div className="flex justify-center my-6">
              <div className="relative w-14">
                <div className="relative bg-[#292d35] rounded-xl overflow-hidden h-[140px]">
                  {nivel === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-gray-500 font-medium transform -rotate-90 whitespace-nowrap text-sm">
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
                        background: `linear-gradient(to bottom, ${colors.light} 0%, ${colors.base} 100%)`,
                        transition: 'height 0.8s ease-out',
                      }}
                    >
                      <div className="wave-top">
                        <div className="wave-curve" style={{ color: colors.base }} />
                        <div className="wave-curve wave2" style={{ color: colors.base }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Información de Volumen */}
            <div className="space-y-3 mb-6 flex-grow">
              <div className="bg-[#292d35] rounded-xl p-3.5">
                <span className="text-gray-400 text-sm block mb-1">Volumen Actual</span>
                <span className="text-white font-medium text-lg tabular-nums">
                  {formatNumber(tank.ultima_lectura?.volumen || 0)} L
                </span>
              </div>
              <div className="bg-[#292d35] rounded-xl p-3.5">
                <span className="text-gray-400 text-sm block mb-1">Capacidad Total</span>
                <span className="text-white font-medium text-lg tabular-nums">
                  {formatNumber(tank.capacidad_total)} L
                </span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedTankId(tank.id);
                  setShowThresholdConfig(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5
                          bg-[#292d35] hover:bg-[#31363f] 
                          border border-[#2d3137]/30
                          rounded-xl text-sm font-medium
                          text-gray-300 hover:text-white
                          transition-all duration-300
                          hover:shadow-lg hover:shadow-black/20"
              >
                <Settings className="w-4 h-4" />
                <span>Configurar</span>
              </button>
              <button
                onClick={() => handleAnalysis(tank.id)}
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5
                          bg-gradient-to-r from-blue-500 to-blue-600
                          hover:from-blue-600 hover:to-blue-700
                          rounded-xl text-sm font-medium text-white
                          transition-all duration-300
                          hover:shadow-lg hover:shadow-blue-500/20"
              >
                <Activity className="w-4 h-4" />
                <span>Análisis</span>
              </button>
            </div>
          </div>
        );
      })}

      {showThresholdConfig && selectedTankId && (
        <ThresholdConfig
          tankId={selectedTankId}
          onClose={() => {
            setSelectedTankId(null);
            setShowThresholdConfig(false);
          }}
        />
      )}
    </div>
  );
};

export default TankStatusDisplay;