import React from 'react';
import { Line } from 'react-chartjs-2';

const FuelLevelChart = ({ data = { labels: [], values: [] }, title = "Nivel de Combustible" }) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Nivel: ${context.raw ? context.raw.toFixed(1) : 0}%`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: { color: '#2D3748' },
        ticks: { color: '#718096' },
        title: { display: true, text: 'Fecha', color: '#718096' },
      },
      y: {
        display: true,
        grid: { color: '#2D3748' },
        ticks: {
          color: '#718096',
          callback: function (value) {
            return `${value}%`;
          },
        },
        title: { display: true, text: 'Nivel (%)', color: '#718096' },
      },
    },
  };

  const chartData = {
    labels: data.labels || ["Sin datos"],
    datasets: [
      {
        data: data.values || [0],
        borderColor: '#6D7DFF',
        backgroundColor: 'rgba(109, 125, 255, 0.2)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-[#1A1F24] p-4 rounded-lg flex-1">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-white text-3xl font-bold">{(data.current || 0).toFixed(1)}%</p>
      <p className="text-gray-500 text-sm mb-2">Nivel promedio últimos 7 días</p>
      <div className="h-48">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default FuelLevelChart;
