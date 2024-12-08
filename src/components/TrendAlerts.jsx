import React from 'react';
import { AlertTriangle } from 'lucide-react';

const TrendAlerts = ({ 
  title = "Alertas de Tendencia",
  alerts = [],
  icon: Icon = AlertTriangle,
  iconColor = "text-yellow-500",
  className = ""
}) => {
  // Estilo neumórfico base
  const neumorphicClass = `
    rounded-[20px] bg-[#1a1d21]
    shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]
    border border-[#232529]
  `;

  return (
    <div className={`${neumorphicClass} p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <Icon className={iconColor} size={20} />
      </div>
      {alerts.length > 0 ? (
        <ul className="space-y-3">
          {alerts.map((alert, index) => (
            <li 
              key={index} 
              className="p-3 rounded-xl bg-[#1f2227] text-gray-300 text-sm
                         transition-all duration-300 hover:bg-[#252830]"
            >
              <div className="flex justify-between">
                <div>
                  <span>{alert.mensaje}</span>
                  {alert.subtexto && (
                    <div className="text-gray-500 text-xs mt-1">
                      {alert.subtexto}
                    </div>
                  )}
                </div>
                <span className="text-gray-500 ml-4">{alert.tiempo}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center">No hay alertas disponibles</p>
      )}
    </div>
  );
};

export default TrendAlerts;