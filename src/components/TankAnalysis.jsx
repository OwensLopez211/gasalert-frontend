import React from 'react';
import FuelLevelChart from './FuelLevelChart';
import AlertsChart from './AlertsChart';
import CostsChart from './CostsChart';

const TankAnalysis = ({
  tank = { nombre: 'Sin nombre' }, // Valor predeterminado para evitar errores
  onBack,
  consumptionData = { labels: [], values: [] }, // Datos predeterminados
  alertsData = { labels: [], values: [] },
  costsData = { labels: [], values: [] },
}) => {
  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="text-blue-400 hover:text-blue-600 underline mb-4"
      >
        ← Volver a la lista de tanques
      </button>
      <h2 className="text-2xl font-bold mb-6 text-white">
        Análisis del Tanque: {tank.nombre || 'Sin nombre'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <FuelLevelChart data={consumptionData} />
        <AlertsChart data={alertsData} />
        <CostsChart data={costsData} />
      </div>
    </div>
  );
};

export default TankAnalysis;
