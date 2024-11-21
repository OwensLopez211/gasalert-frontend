import React from 'react';
import { Bar } from 'react-chartjs-2';

const CostsChart = ({ data = { labels: [], values: [] }, title = "Costo Mensual" }) => {
  const chartData = {
    labels: data.labels || ["Sin datos"],
    datasets: [
      {
        data: data.values || [0],
        backgroundColor: '#6D7DFF',
        borderColor: '#4C60FF',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Costo: $${context.raw.toLocaleString('es-ES')}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: { color: '#2D3748' },
        ticks: { color: '#718096' },
        title: { display: true, text: 'Mes', color: '#718096' },
      },
      y: {
        display: true,
        grid: { color: '#2D3748' },
        ticks: {
          color: '#718096',
          callback: function (value) {
            return `$${value.toLocaleString('es-ES')}`;
          },
        },
        title: { display: true, text: 'Costo ($)', color: '#718096' },
      },
    },
  };

  return (
    <div className="bg-[#1A1F24] p-4 rounded-lg flex-1">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-white text-3xl font-bold">
        ${data.total ? data.total.toLocaleString('es-ES') : 0}
      </p>
      <div className="h-48">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CostsChart;
