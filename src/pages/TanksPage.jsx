import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import UmbralForm from "../components/UmbralForm";

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
        const token = localStorage.getItem("access_token"); // Obtén el token
        const response = await axios.get(
          `http://localhost:8000/api/tanks?estacion_id=${estacionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
            },
          }
        );

        setTanks(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tanks:", err);
        if (err.response && err.response.status === 401) {
          alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          navigate("/login"); // Redirige al inicio de sesión
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
    <div>
      <h1 className="text-2xl font-bold mb-4 text-white">Tanques</h1>

      {!selectedTank && (
        <table className="table-auto w-full text-left text-white border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="py-2 px-4 border-b border-gray-700">Nombre</th>
              <th className="py-2 px-4 border-b border-gray-700">Capacidad Total</th>
              <th className="py-2 px-4 border-b border-gray-700">Nivel Actual</th>
              <th className="py-2 px-4 border-b border-gray-700">Estado</th>
              <th className="py-2 px-4 border-b border-gray-700">Última Actualización</th>
              <th className="py-2 px-4 border-b border-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tanks.map((tank) => (
              <tr key={tank.id} className="border-b border-gray-700">
                <td className="py-3 px-4">{tank.nombre}</td>
                <td className="py-3 px-4">
                  {tank.capacidad_total?.toLocaleString("es-ES")} L
                </td>
                <td className="py-3 px-4">
                  {tank.ultima_lectura?.nivel
                    ? `${tank.ultima_lectura.nivel.toFixed(1)}%`
                    : "Sin datos"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      tank.estado === "normal"
                        ? "bg-green-500"
                        : tank.estado === "bajo"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {tank.estado}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {tank.ultima_lectura?.fecha
                    ? new Date(tank.ultima_lectura.fecha).toLocaleString("es-ES")
                    : "Sin datos"}
                </td>
                <td className="py-3 px-4">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setSelectedTank(tank)} // Seleccionar tanque
                  >
                    Configurar Umbrales
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedTank && (
        <div>
          <button
            className="text-blue-500 hover:underline mb-4"
            onClick={() => setSelectedTank(null)} // Regresar a la lista
          >
            ← Volver a la lista de tanques
          </button>
          <UmbralForm tank={selectedTank} />
        </div>
      )}
    </div>
  );
};

export default TanksPage;
