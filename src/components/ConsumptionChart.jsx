import React from 'react';
import { Line } from 'react-chartjs-2';

const DailyConsumptionChart = ({ data, title = "Consumo Diario" }) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Consumo: ${context.raw.toLocaleString('es-ES', { 
              minimumFractionDigits: 1, 
              maximumFractionDigits: 1 
            })} L`;
          },
          title: function(context) {
            return `Día: ${context[0].label}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: '#2D3748'
        },
        ticks: { 
          color: '#718096'
        },
        title: {
          display: true,
          text: 'Fecha',
          color: '#718096'
        }
      },
      y: {
        display: true,
        grid: {
          color: '#2D3748'
        },
        ticks: {
          color: '#718096',
          callback: function(value) {
            return `${value.toLocaleString('es-ES')} L`;
          }
        },
        title: {
          display: true,
          text: 'Consumo (Litros)',
          color: '#718096'
        }
      }
    }
  };

  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        data: data.values || [],
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
      <p className="text-white text-3xl font-bold">
        {(data.total || 0).toLocaleString('es-ES', { 
          minimumFractionDigits: 1, 
          maximumFractionDigits: 1 
        })} L
      </p>
      <p className="text-gray-500 text-sm mb-2">Total últimos 7 días</p>
      <p className="text-gray-400 text-xs mb-4">
        Promedio diario: {((data.total || 0) / 7).toLocaleString('es-ES', { 
          minimumFractionDigits: 1, 
          maximumFractionDigits: 1 
        })} L
      </p>
      <div className="h-48">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="mt-4 text-xs text-gray-400">
        * El consumo se calcula como la diferencia de volumen entre lecturas consecutivas
      </div>
    </div>
  );
};

export default DailyConsumptionChart;