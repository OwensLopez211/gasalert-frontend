import React from 'react';
import { Pie } from 'react-chartjs-2';

const AlertsChart = ({ data = { labels: [], values: [] }, title = "Alertas por Estado" }) => {
  const chartData = {
    labels: data.labels || ["Sin datos"],
    datasets: [
      {
        data: data.values || [0],
        backgroundColor: ['#FF6384', '#FF9F40', '#4CAF50'],
        hoverBackgroundColor: ['#FF4D6D', '#FF8433', '#3EAF4C'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#718096' } },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-[#1A1F24] p-4 rounded-lg flex-1">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-white text-3xl font-bold">{data.total || 0}</p>
      <div className="h-48">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AlertsChart;
