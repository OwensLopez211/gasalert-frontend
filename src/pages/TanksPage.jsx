import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import TankAnalysis from "../components/TankAnalysis";

const API_URL = process.env.REACT_APP_API_URL;

const TanksPage = () => {
  const [tanks, setTanks] = useState([]);
  const [selectedTank, setSelectedTank] = useState(null); // Tanque seleccionado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const estacionId = user?.estaciones?.[0]?.id;

  useEffect(() => {
    const fetchTanks = async () => {
      if (!estacionId) {
        setError("No se encontró una estación asociada.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `${API_URL}/tanks?estacion_id=${estacionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTanks(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tanks:", err);
        if (err.response && err.response.status === 401) {
          alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          navigate("/login");
        } else {
          setError("No se pudieron cargar los tanques.");
        }
        setLoading(false);
      }
    };

    fetchTanks();
  }, [estacionId, navigate]);

  if (loading) return <p className="text-white">Cargando tanques...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Tanques</h1>

      {/* Mostrar lista de tanques si no hay un tanque seleccionado */}
      {!selectedTank && (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
          <table className="table-auto w-full text-left text-white">
            <thead>
              <tr className="bg-gray-900 text-gray-400">
                <th className="py-3 px-6">Nombre</th>
                <th className="py-3 px-6">Capacidad Total</th>
                <th className="py-3 px-6">Nivel Actual</th>
                <th className="py-3 px-6">Estado</th>
                <th className="py-3 px-6">Última Actualización</th>
                <th className="py-3 px-6">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tanks.map((tank) => (
                <tr
                  key={tank.id}
                  className="border-t border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  <td className="py-4 px-6">{tank.nombre}</td>
                  <td className="py-4 px-6">
                    {tank.capacidad_total?.toLocaleString("es-ES")} L
                  </td>
                  <td className="py-4 px-6">
                    {tank.ultima_lectura?.nivel
                      ? `${tank.ultima_lectura.nivel.toFixed(1)}%`
                      : "Sin datos"}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                        tank.estado === "normal"
                          ? "bg-green-500 text-white"
                          : tank.estado === "bajo"
                          ? "bg-yellow-500 text-black"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {tank.estado}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {tank.ultima_lectura?.fecha
                      ? new Date(tank.ultima_lectura.fecha).toLocaleString("es-ES")
                      : "Sin datos"}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      className="text-blue-400 hover:text-blue-600 font-medium underline"
                      onClick={() => setSelectedTank(tank)} // Seleccionar tanque
                    >
                      Ver Análisis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mostrar análisis del tanque seleccionado */}
      {selectedTank && (
        <TankAnalysis tank={selectedTank} onBack={() => setSelectedTank(null)} />
      )}
    </div>
  );
};

export default TanksPage;
