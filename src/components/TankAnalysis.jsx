import React, { useEffect, useState } from "react";
import axios from "axios";

const TankAnalysis = ({ tankId, onClose }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `http://localhost:8000/api/tanks/analytics/${tankId}/detail/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAnalysisData(response.data);
      } catch (err) {
        setError("No se pudieron cargar los datos de análisis.");
      } finally {
        setLoading(false);
      }
    };    

    fetchAnalysisData();
  }, [tankId]);

  if (loading) return <div className="text-white">Cargando análisis...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 rounded-lg bg-[#1a1d21] shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4">Análisis del Tanque</h2>
      <div className="space-y-4">
        <p><strong>Consumo promedio diario:</strong> {analysisData.daily_average} L</p>
        <p><strong>Alertas activas:</strong> {analysisData.active_alerts}</p>
        <p><strong>Nivel crítico alcanzado:</strong> {analysisData.critical_hits} veces</p>
        {/* Agregar más análisis según los datos disponibles */}
      </div>
      <button
        onClick={onClose}
        className="mt-4 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white py-2 px-4 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all"
      >
        Cerrar
      </button>
    </div>
  );
};

export default TankAnalysis;
