import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const ThresholdConfig = ({ tankId, onClose }) => {
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [availableThresholds, setAvailableThresholds] = useState([
    "LIMITE",
    "ALTO",
    "MEDIO",
    "BAJO",
    "CRITICO",
  ]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [thresholdToDelete, setThresholdToDelete] = useState(null);

  const thresholdConfig = useMemo(() => ({
    CRITICO: { defaultValue: 15, min: 0, max: 25 },
    BAJO: { defaultValue: 30, min: 26, max: 45 },
    MEDIO: { defaultValue: 50, min: 46, max: 69 },
    ALTO: { defaultValue: 70, min: 70, max: 90 },
    LIMITE: { defaultValue: 90, min: 91, max: 100 },
  }), []);

  const getThresholdColor = (type) => {
    const colors = {
      LIMITE: 'from-amber-500 to-orange-600',
      ALTO: 'from-orange-400 to-red-500',
      MEDIO: 'from-blue-400 to-blue-600',
      BAJO: 'from-yellow-400 to-orange-500',
      CRITICO: 'from-red-500 to-red-700'
    };
    return colors[type] || 'from-gray-400 to-gray-600';
  };

  const api = useMemo(() => axios.create({
    baseURL: `${API_URL}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  }), []);

  const loadThresholds = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/alerts/umbrales/?tanque_id=${tankId}`);
      const orderedThresholds = response.data.sort((a, b) => {
        const order = ["LIMITE", "ALTO", "MEDIO", "BAJO", "CRITICO"];
        return order.indexOf(a.tipo) - order.indexOf(b.tipo);
      });

      setThresholds(orderedThresholds);

      const temp = {};
      orderedThresholds.forEach((threshold) => {
        temp[threshold.id] = threshold.valor;
      });
      setTempValues(temp);

      const existingTypes = orderedThresholds.map((t) => t.tipo);
      setAvailableThresholds((prev) =>
        prev.filter((type) => !existingTypes.includes(type))
      );
    } catch (err) {
      setError("Error cargando umbrales");
    } finally {
      setLoading(false);
    }
  }, [tankId, api]);

  const handleAddThreshold = useCallback(async (type) => {
    try {
      const { defaultValue } = thresholdConfig[type];
      const payload = {
        tanque: tankId,
        tipo: type,
        valor: defaultValue,
        activo: true,
      };

      const response = await api.post("/alerts/umbrales/", payload);

      setThresholds((prev) => [...prev, response.data]);
      setTempValues((prev) => ({
        ...prev,
        [response.data.id]: defaultValue,
      }));

      setAvailableThresholds((prev) => prev.filter((t) => t !== type));
    } catch (err) {
      setError(
        `Error agregando umbral: ${err.response?.data?.detail || "Desconocido"}`
      );
    }
  }, [tankId, api, thresholdConfig]);

  const handleThresholdUpdate = useCallback(async (id, valor) => {
    try {
      await api.patch(`/alerts/umbrales/${id}/`, { valor });
    } catch (err) {
      setError("Error actualizando umbral");
    }
  }, [api]);

  const handleDeleteThreshold = useCallback(async (id) => {
    try {
      const deletedThreshold = thresholds.find((threshold) => threshold.id === id);
  
      await api.delete(`/alerts/umbrales/${id}/`);
  
      setThresholds((prev) => prev.filter((threshold) => threshold.id !== id));
  
      if (deletedThreshold) {
        setAvailableThresholds((prev) => [...prev, deletedThreshold.tipo]);
      }
  
      setShowConfirmation(false);
    } catch (err) {
      setError("Error eliminando umbral");
    }
  }, [api, thresholds]);

  const handleSliderChange = useCallback((id, type, value) => {
    const { min, max } = thresholdConfig[type];
    const clampedValue = Math.min(Math.max(value, min), max);

    setTempValues((prev) => ({
      ...prev,
      [id]: clampedValue,
    }));
  }, [thresholdConfig]);

  const handleSave = useCallback(() => {
    Object.keys(tempValues).forEach((id) => {
      handleThresholdUpdate(id, tempValues[id]);
    });
    onClose();
  }, [tempValues, handleThresholdUpdate, onClose]);

  useEffect(() => {
    if (tankId) {
      loadThresholds();
    } else {
      setError("Tank ID no proporcionado");
    }
  }, [tankId, loadThresholds]);

  if (loading) return <div>...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop con blur */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

      {/* Contenedor principal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform rounded-2xl bg-[#1f2227] p-6 text-left shadow-xl transition-all border border-[#2d3137]/50">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Configurar Umbrales
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Ajusta los valores de los umbrales para generar alertas según los niveles de los tanques.
            </p>
          </div>

          {/* Lista de Umbrales */}
          <div className="space-y-6">
            {thresholds.map((threshold) => (
              <div key={threshold.id} className="bg-[#181a1f] rounded-xl p-4 border border-[#2d3137]/30">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-full sm:w-32">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getThresholdColor(threshold.tipo)} text-white`}>
                      {threshold.tipo}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="range"
                          min={thresholdConfig[threshold.tipo]?.min || 0}
                          max={thresholdConfig[threshold.tipo]?.max || 100}
                          value={tempValues[threshold.id] || 0}
                          onChange={(e) =>
                            handleSliderChange(
                              threshold.id,
                              threshold.tipo,
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full h-2 rounded-full appearance-none bg-gray-700 accent-blue-500
                                   [&::-webkit-slider-thumb]:appearance-none
                                   [&::-webkit-slider-thumb]:w-4
                                   [&::-webkit-slider-thumb]:h-4
                                   [&::-webkit-slider-thumb]:rounded-full
                                   [&::-webkit-slider-thumb]:bg-blue-500
                                   [&::-webkit-slider-thumb]:cursor-pointer
                                   [&::-webkit-slider-thumb]:shadow-lg
                                   [&::-webkit-slider-thumb]:shadow-blue-500/50"
                        />
                      </div>
                      <div className="w-16 text-right">
                        <span className="text-lg font-semibold text-gray-200">
                          {tempValues[threshold.id] || 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setThresholdToDelete(threshold.id);
                      setShowConfirmation(true);
                    }}
                    className="p-2 rounded-full hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Agregar Nuevo Umbral */}
          {availableThresholds.length > 0 && (
            <div className="mt-6 bg-[#181a1f] rounded-xl p-4 border border-[#2d3137]/30">
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                Agregar Nuevo Umbral
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableThresholds.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddThreshold(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium
                              bg-gradient-to-r ${getThresholdColor(type)}
                              text-white shadow-lg hover:shadow-xl
                              transition-all duration-300 hover:scale-105`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#181a1f] text-gray-400 hover:text-gray-200 border border-[#2d3137]/30 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg
                       hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-[#1f2227] rounded-2xl p-6 max-w-sm w-full mx-4 border border-[#2d3137]/50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">¿Eliminar umbral?</h3>
              <p className="text-gray-400 text-center mb-6">
                Esta acción no se puede deshacer y podría afectar las alertas configuradas.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-[#181a1f] text-gray-400 hover:text-gray-200
                           border border-[#2d3137]/30 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteThreshold(thresholdToDelete)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600
                           text-white shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThresholdConfig;