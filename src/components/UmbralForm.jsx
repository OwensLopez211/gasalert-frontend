import React, { useState, useEffect } from "react";
import axios from "axios";

const UmbralForm = ({ tank }) => {
  const [thresholds, setThresholds] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThresholds = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No se encontró el token de autenticación.");
        }

        const response = await axios.get(
          `http://localhost:8000/api/tanks/${tank.id}/thresholds`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setThresholds(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching thresholds:", error);
        setError("No se pudieron cargar los umbrales. Intenta nuevamente.");
        setLoading(false);
      }
    };

    fetchThresholds();
  }, [tank.id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      await axios.post(
        `http://localhost:8000/api/tanks/${tank.id}/thresholds`,
        { umbrales: thresholds }, // Ajusta la estructura según la API
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Umbrales guardados con éxito.");
      setSaving(false);
    } catch (error) {
      console.error("Error saving thresholds:", error);
      setError("No se pudieron guardar los umbrales. Intenta nuevamente.");
      setSaving(false);
    }
  };

  if (loading) return <p className="text-white">Cargando umbrales...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">
        Configurar Umbrales para {tank.nombre}
      </h2>
      {["CRITICO", "BAJO", "MEDIO", "ALTO", "LIMITE"].map((type) => (
        <div key={type} className="mb-4">
          <label className="block text-white mb-1">{type}</label>
          <input
            type="number"
            value={thresholds[type] || ""}
            onChange={(e) =>
              setThresholds({
                ...thresholds,
                [type]: Math.min(Math.max(parseFloat(e.target.value) || 0, 0), 100),
              }) // Validación directa
            }
            className="w-full p-2 border rounded"
            min="0"
            max="100"
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`${
          saving ? "bg-gray-400" : "bg-blue-500"
        } text-white px-4 py-2 rounded`}
      >
        {saving ? "Guardando..." : "Guardar Umbrales"}
      </button>
    </div>
  );
};

export default UmbralForm;
