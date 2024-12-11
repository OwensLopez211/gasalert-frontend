import axios from 'axios';

class ReportGenerationService {
  constructor() {
    this.API_URL = process.env.REACT_APP_API_URL;
    this.axiosInstance = axios.create({
      baseURL: this.API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Configurar token de autenticación
  setAuthToken(token) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // 1. Procedimiento para obtener resumen de consumo por tanque
  async getConsumptionSummary(tankId, startDate, endDate) {
    try {
      const response = await this.axiosInstance.get('/reports/consumption-summary/', {
        params: {
          tank_id: tankId,
          start_date: startDate,
          end_date: endDate,
          procedure: 'sp_consumption_summary'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener resumen de consumo');
    }
  }

  // 2. Procedimiento para obtener historial de lecturas
  async getReadingsHistory(tankId, interval, startDate, endDate) {
    try {
      const response = await this.axiosInstance.get('/reports/readings-history/', {
        params: {
          tank_id: tankId,
          interval: interval,
          start_date: startDate,
          end_date: endDate,
          procedure: 'sp_readings_history'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener historial de lecturas');
    }
  }

  // 3. Procedimiento para obtener alertas del período
  async getPeriodAlerts(stationId, startDate, endDate) {
    try {
      const response = await this.axiosInstance.get('/reports/period-alerts/', {
        params: {
          station_id: stationId,
          start_date: startDate,
          end_date: endDate,
          procedure: 'sp_period_alerts'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener alertas del período');
    }
  }

  // 4. Procedimiento para obtener estadísticas de reposición
  async getRefillStats(tankId, startDate, endDate) {
    try {
      const response = await this.axiosInstance.get('/reports/refill-stats/', {
        params: {
          tank_id: tankId,
          start_date: startDate,
          end_date: endDate,
          procedure: 'sp_refill_statistics'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener estadísticas de reposición');
    }
  }

  // 5. Procedimiento para obtener análisis de eficiencia
  async getEfficiencyAnalysis(stationId, startDate, endDate) {
    try {
      const response = await this.axiosInstance.get('/reports/efficiency-analysis/', {
        params: {
          station_id: stationId,
          start_date: startDate,
          end_date: endDate,
          procedure: 'sp_efficiency_analysis'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener análisis de eficiencia');
    }
  }

  // Método para generar el reporte completo
  async generateFullReport(params) {
    try {
      const { tankId, stationId, startDate, endDate, interval, format } = params;
      
      // Obtener datos de todos los procedimientos almacenados
      const [
        consumptionSummary,
        readingsHistory,
        periodAlerts,
        refillStats,
        efficiencyAnalysis
      ] = await Promise.all([
        this.getConsumptionSummary(tankId, startDate, endDate),
        this.getReadingsHistory(tankId, interval, startDate, endDate),
        this.getPeriodAlerts(stationId, startDate, endDate),
        this.getRefillStats(tankId, startDate, endDate),
        this.getEfficiencyAnalysis(stationId, startDate, endDate)
      ]);

      // Generar el reporte en el formato solicitado
      const response = await this.axiosInstance.post('/reports/generate/', {
        format,
        data: {
          consumptionSummary,
          readingsHistory,
          periodAlerts,
          refillStats,
          efficiencyAnalysis
        }
      }, {
        responseType: 'blob' // Para manejar la descarga del archivo
      });

      return response.data;
    } catch (error) {
      throw new Error('Error al generar el reporte completo');
    }
  }
}

export default ReportGenerationService;