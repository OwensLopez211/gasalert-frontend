import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const TankStatusTable = () => {
  const { user } = useContext(AuthContext);
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [lowLevelAlerts, setLowLevelAlerts] = useState(0);
  const [criticalLevelAlerts, setCriticalLevelAlerts] = useState(0);

  const estacionId = user?.estaciones?.[0]?.id;

  useEffect(() => {
    const fetchTanks = async () => {
      if (!estacionId) {
        setError("No se encontró una estación asociada.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/tanks?estacion_id=${estacionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        const tanksData = response.data;
        setTanks(tanksData);

        // Calculate summary data
        const capacity = tanksData.reduce(
          (acc, tank) => acc + tank.capacidad_total,
          0
        );
        const lowAlerts = tanksData.filter((tank) => tank.estado === "bajo")
          .length;
        const criticalAlerts = tanksData.filter(
          (tank) => tank.estado === "critico"
        ).length;

        setTotalCapacity(capacity);
        setLowLevelAlerts(lowAlerts);
        setCriticalLevelAlerts(criticalAlerts);

        setLoading(false);
      } catch (err) {
        setError("No se pudieron cargar los tanques");
        setLoading(false);
      }
    };

    fetchTanks();

    // Establecer la conexión WebSocket para recibir actualizaciones en tiempo real
    const socket = new WebSocket("ws://localhost:8001/ws/tank_status/");

    socket.onopen = () => {
      console.log("Conexión WebSocket establecida");
    };

    socket.onmessage = (event) => {
      console.log("Mensaje recibido:", event.data);
      const data = JSON.parse(event.data);

      // Actualiza el nivel en tiempo real para el tanque correspondiente
      setTanks((prevTanks) =>
        prevTanks.map((tank) =>
          tank.id === data.tank_id
            ? { ...tank, ultima_lectura: data.ultima_lectura }
            : tank
        )
      );
    };

    socket.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    socket.onclose = () => {
      console.log("Conexión WebSocket cerrada");
    };

    return () => {
      socket.close();
    };
  }, [estacionId]);

  if (loading) return <p>Cargando tanques...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-[#111517] p-6 rounded-lg border border-gray-700">
      <h2 className="text-white text-lg font-bold mb-4">Tanques de bencina</h2>

      {/* Resumen general */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Capacidad Total</p>
          <p className="text-white text-2xl font-bold">
            {totalCapacity.toLocaleString("es-ES", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}{" "}
            Litros
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Low Level Alerts</p>
          <p className="text-white text-2xl font-bold">{lowLevelAlerts}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Critical Level Alerts</p>
          <p className="text-white text-2xl font-bold">{criticalLevelAlerts}</p>
        </div>
      </div>

      {/* Monitoreo en tiempo real */}
      <h3 className="text-white text-md font-semibold mb-4">
        Monitoreo en Tiempo Real
      </h3>
      <table className="w-full text-left text-white border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800">
            <th className="py-2 px-4 border-b border-gray-700">Tanque</th>
            <th className="py-2 px-4 border-b border-gray-700">Nivel actual</th>
            <th className="py-2 px-4 border-b border-gray-700">Capacidad</th>
            <th className="py-2 px-4 border-b border-gray-700">Estado</th>
            <th className="py-2 px-4 border-b border-gray-700">
              Última actualización
            </th>
          </tr>
        </thead>
        <tbody>
          {tanks.map((tank, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="py-3 px-4">{tank.nombre}</td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div className="h-2 w-full bg-gray-600 rounded-full mr-2">
                    <div
                      className={`h-2 rounded-full ${
                        tank.ultima_lectura?.nivel > 75
                          ? "bg-green-500"
                          : tank.ultima_lectura?.nivel > 40
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${tank.ultima_lectura?.nivel || 0}%`,
                      }}
                    ></div>
                  </div>
                  <span>
                    {tank.ultima_lectura
                      ? `${tank.ultima_lectura.volumen.toLocaleString("es-ES", {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })} L (${tank.ultima_lectura.nivel
                          .toFixed(1)
                          .replace(".", ",")}%)`
                      : "Sin datos"}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                {tank.capacidad_total.toLocaleString("es-ES", {
                  maximumFractionDigits: 1,
                })}{" "}
                Litros
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TankStatusTable;
