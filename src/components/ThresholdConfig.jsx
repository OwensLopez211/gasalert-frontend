import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { X, Trash2, AlertTriangle } from 'lucide-react';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-[520px] bg-[#1a1d21] rounded-2xl shadow-2xl border border-white/[0.05]">
        {/* Header */}
        <div className="border-b border-white/[0.05] bg-gradient-to-b from-white/[0.02] to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Configurar Umbrales
              </h2>
              <p className="text-sm text-gray-400">
                Ajusta los valores para las alertas
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-300 hover:bg-white/[0.05]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="p-4">
          <div className="space-y-3">
            {thresholds.map((threshold) => (
              <div 
                key={threshold.id} 
                className="bg-[#1f2227] rounded-lg p-3 border border-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <span className={`
                    px-2.5 py-1 rounded-md text-xs font-medium w-20 text-center
                    bg-gradient-to-r ${getThresholdColor(threshold.tipo)} 
                    text-white
                  `}>
                    {threshold.tipo}
                  </span>
                  
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="range"
                      min={thresholdConfig[threshold.tipo]?.min || 0}
                      max={thresholdConfig[threshold.tipo]?.max || 100}
                      value={tempValues[threshold.id] || 0}
                      onChange={(e) => handleSliderChange(
                        threshold.id,
                        threshold.tipo,
                        parseFloat(e.target.value)
                      )}
                      className="flex-1 h-1.5 rounded-full appearance-none bg-[#292d35] 
                               [&::-webkit-slider-thumb]:appearance-none
                               [&::-webkit-slider-thumb]:w-3
                               [&::-webkit-slider-thumb]:h-3
                               [&::-webkit-slider-thumb]:rounded-full
                               [&::-webkit-slider-thumb]:bg-blue-500
                               [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <span className="text-sm font-medium text-white w-12 text-right tabular-nums">
                      {tempValues[threshold.id] || 0}%
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setThresholdToDelete(threshold.id);
                      setShowConfirmation(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Agregar Nuevo Umbral */}
          {availableThresholds.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/[0.05]">
              <div className="flex flex-wrap gap-2">
                {availableThresholds.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddThreshold(type)}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-medium
                      bg-gradient-to-r ${getThresholdColor(type)}
                      text-white transition-all duration-200
                      hover:scale-105 active:scale-95
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.05] bg-[#1f2227] p-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] 
                       text-gray-300 hover:text-white text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600
                       text-white text-sm hover:from-blue-600 hover:to-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-[110]">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
            onClick={() => setShowConfirmation(false)} 
          />
          <div className="relative w-[320px] bg-[#1a1d21] rounded-xl p-4 border border-white/[0.05]">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">¿Eliminar umbral?</h3>
              <p className="text-sm text-gray-400 text-center mb-4">
                Esta acción no se puede deshacer.
              </p>

              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1]
                           text-gray-300 hover:text-white text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteThreshold(thresholdToDelete)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600
                           text-white text-sm hover:from-red-600 hover:to-red-700"
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