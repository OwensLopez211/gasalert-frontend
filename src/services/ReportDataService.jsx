// services/reports/ReportDataService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class ReportDataService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
  }

  async getTanksStatus() {
    try {
      const response = await this.api.get('/tanks/');
      const tanks = response.data;

      return tanks.map(tank => ({
        id: tank.id,
        nombre: tank.nombre,
        tipo_combustible: tank.tipo_combustible_nombre,
        capacidad_total: tank.capacidad_total,
        nivel_actual: tank.ultima_lectura?.nivel || 0,
        volumen_actual: tank.ultima_lectura?.volumen || 0,
        temperatura: tank.ultima_lectura?.temperatura,
        ultima_actualizacion: tank.ultima_lectura?.fecha,
        estado: this.determinarEstadoTanque(tank)
      }));
    } catch (error) {
      console.error('Error obteniendo estado de tanques:', error);
      throw error;
    }
  }

  determinarEstadoTanque(tank) {
    if (!tank.ultima_lectura) return 'SIN_DATOS';
    const nivel = tank.ultima_lectura.nivel;
    
    if (nivel >= 75) return 'ÓPTIMO';
    if (nivel >= 40) return 'NORMAL';
    if (nivel >= 20) return 'BAJO';
    return 'CRÍTICO';
  }

  async getAlerts(dateRange) {
    try {
      const response = await this.api.get('/alerts/alertas/', {
        params: { date_range: dateRange }
      });
      const alerts = response.data;

      const alertsSummary = {
        total: alerts.length,
        por_tipo: this.agruparAlertasPorTipo(alerts),
        por_estado: this.agruparAlertasPorEstado(alerts),
        tendencias: this.analizarTendenciasAlertas(alerts),
        recientes: alerts.slice(0, 5) // últimas 5 alertas
      };

      return alertsSummary;
    } catch (error) {
      console.error('Error obteniendo alertas:', error);
      throw error;
    }
  }

  agruparAlertasPorTipo(alerts) {
    return alerts.reduce((acc, alert) => {
      const tipo = alert.tipo_umbral || 'OTRO';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});
  }

  agruparAlertasPorEstado(alerts) {
    return alerts.reduce((acc, alert) => {
      acc[alert.estado] = (acc[alert.estado] || 0) + 1;
      return acc;
    }, {});
  }

  analizarTendenciasAlertas(alerts) {
    // Implementar análisis de tendencias de alertas
    // Por ejemplo: frecuencia por hora del día, días de la semana, etc.
    return {
      frecuencia_diaria: this.calcularFrecuenciaDiaria(alerts),
      patrones_horarios: this.identificarPatronesHorarios(alerts)
    };
  }

  async getConsumptionMetrics(dateRange) {
    try {
      const tanks = await this.getTanksStatus();
      const consumptionData = await Promise.all(
        tanks.map(async tank => {
          const response = await this.api.get(`/tanks/analytics/consumo-promedio/`, {
            params: {
              tanque_id: tank.id,
              range: dateRange
            }
          });

          return {
            tanque_id: tank.id,
            nombre_tanque: tank.nombre,
            datos_consumo: response.data
          };
        })
      );

      return {
        consumo_total: this.calcularConsumoTotal(consumptionData),
        consumo_por_tanque: consumptionData,
        promedios: this.calcularPromediosConsumo(consumptionData),
        eficiencia: this.calcularEficienciaConsumo(consumptionData)
      };
    } catch (error) {
      console.error('Error obteniendo métricas de consumo:', error);
      throw error;
    }
  }

  async getTrends(dateRange) {
    try {
      const tanks = await this.getTanksStatus();
      const trendsData = await Promise.all(
        tanks.map(async tank => {
          const response = await this.api.get(`/tanks/analytics/${tank.id}/tendencia_consumo/`, {
            params: { range: dateRange }
          });

          return {
            tanque_id: tank.id,
            nombre_tanque: tank.nombre,
            tendencias: response.data
          };
        })
      );

      return {
        tendencias_por_tanque: trendsData,
        patrones_identificados: this.identificarPatrones(trendsData),
        predicciones: await this.generarPredicciones(trendsData)
      };
    } catch (error) {
      console.error('Error obteniendo tendencias:', error);
      throw error;
    }
  }

  async getRecommendations() {
    // Generar recomendaciones basadas en el análisis de datos
    const [tanks, alerts, consumption] = await Promise.all([
      this.getTanksStatus(),
      this.getAlerts('7d'), // últimos 7 días
      this.getConsumptionMetrics('7d')
    ]);

    return this.generateRecommendations(tanks, alerts, consumption);
  }

  generateRecommendations(tanks, alerts, consumption) {
    const recommendations = [];

    // Recomendaciones basadas en niveles de tanques
    tanks.forEach(tank => {
      if (tank.nivel_actual < 30) {
        recommendations.push({
          tipo: 'REPOSICION',
          prioridad: 'ALTA',
          mensaje: `Programar reposición para tanque ${tank.nombre} (nivel actual: ${tank.nivel_actual}%)`
        });
      }
    });

    // Recomendaciones basadas en alertas
    if (alerts.total > 10) {
      recommendations.push({
        tipo: 'MANTENIMIENTO',
        prioridad: 'MEDIA',
        mensaje: 'Revisar y ajustar umbrales de alertas para reducir falsos positivos'
      });
    }

    // Recomendaciones basadas en consumo
    const { eficiencia } = consumption;
    if (eficiencia < 80) {
      recommendations.push({
        tipo: 'OPTIMIZACION',
        prioridad: 'MEDIA',
        mensaje: 'Optimizar patrones de consumo para mejorar la eficiencia operativa'
      });
    }

    return recommendations;
  }

  // Métodos auxiliares
  calcularFrecuenciaDiaria(alerts) {
    // Implementar cálculo de frecuencia diaria de alertas
    return {};
  }

  identificarPatronesHorarios(alerts) {
    // Implementar identificación de patrones horarios
    return {};
  }

  calcularConsumoTotal(consumptionData) {
    // Implementar cálculo de consumo total
    return 0;
  }

  calcularPromediosConsumo(consumptionData) {
    // Implementar cálculo de promedios de consumo
    return {};
  }

  calcularEficienciaConsumo(consumptionData) {
    // Implementar cálculo de eficiencia de consumo
    return {};
  }

  identificarPatrones(trendsData) {
    // Implementar identificación de patrones
    return {};
  }

  async generarPredicciones(trendsData) {
    // Implementar generación de predicciones
    return {};
  }
}

export default ReportDataService;