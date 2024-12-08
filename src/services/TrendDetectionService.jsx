class TrendDetectionService {
    // Constantes para configuración
    static CONSUMPTION_THRESHOLD = 15; // % de cambio que dispara alerta de consumo
    static REFILL_PATTERN_DAYS = 7;    // Días para analizar patrones de reposición
    static CRITICAL_LEVEL_FREQUENCY = 3; // Número de veces para considerar frecuencia alta
    static UNUSUAL_VARIANCE_THRESHOLD = 2; // Desviaciones estándar para considerar inusual
  
    /**
     * Detecta tendencias inusuales en el consumo
     * @param {Array} readings - Array de lecturas [{fecha, nivel, volumen}]
     * @returns {Array} Alertas detectadas
     */
    static detectConsumptionTrends(readings) {
      const alerts = [];
      
      if (!readings || readings.length < 2) return alerts;
  
      // Calcular cambios en el consumo
      const consumptionChanges = [];
      for (let i = 1; i < readings.length; i++) {
        const volumeChange = readings[i].volumen - readings[i-1].volumen;
        const timeChange = (new Date(readings[i].fecha) - new Date(readings[i-1].fecha)) / (1000 * 60 * 60); // horas
        const hourlyRate = Math.abs(volumeChange / timeChange);
        consumptionChanges.push(hourlyRate);
      }
  
      // Calcular estadísticas básicas
      const avgConsumption = this.calculateAverage(consumptionChanges);
      const stdConsumption = this.calculateStandardDeviation(consumptionChanges, avgConsumption);
  
      // Detectar consumos inusuales
      consumptionChanges.forEach((rate, index) => {
        if (Math.abs(rate - avgConsumption) > stdConsumption * this.UNUSUAL_VARIANCE_THRESHOLD) {
          alerts.push({
            tipo: 'CONSUMO_INUSUAL',
            mensaje: `Consumo inusual detectado: ${rate.toFixed(2)} L/h vs promedio de ${avgConsumption.toFixed(2)} L/h`,
            fecha: readings[index + 1].fecha,
            severidad: 'ALTA'
          });
        }
      });
  
      return alerts;
    }
  
    /**
     * Detecta patrones inusuales en reposiciones
     * @param {Array} refills - Array de reposiciones [{fecha, volumen}]
     * @returns {Array} Alertas detectadas
     */
    static detectRefillPatterns(refills) {
      const alerts = [];
      if (!refills || refills.length < this.REFILL_PATTERN_DAYS) return alerts;
  
      // Agrupar reposiciones por día
      const dailyRefills = this.groupRefillsByDay(refills);
      
      // Calcular estadísticas de reposiciones diarias
      const avgDailyRefills = this.calculateAverage(Object.values(dailyRefills));
      const stdDailyRefills = this.calculateStandardDeviation(Object.values(dailyRefills), avgDailyRefills);
  
      // Detectar patrones irregulares
      Object.entries(dailyRefills).forEach(([date, count]) => {
        if (Math.abs(count - avgDailyRefills) > stdDailyRefills * this.UNUSUAL_VARIANCE_THRESHOLD) {
          alerts.push({
            tipo: 'PATRON_REPOSICION',
            mensaje: `Patrón de reposición irregular: ${count} reposiciones el ${date}`,
            fecha: date,
            severidad: count > avgDailyRefills ? 'MEDIA' : 'BAJA'
          });
        }
      });
  
      return alerts;
    }
  
    /**
     * Detecta frecuencia de niveles críticos
     * @param {Array} readings - Array de lecturas [{fecha, nivel}]
     * @param {Number} criticalLevel - Nivel considerado crítico
     * @returns {Array} Alertas detectadas
     */
    static detectCriticalLevelFrequency(readings, criticalLevel = 20) {
      const alerts = [];
      if (!readings || readings.length < 2) return alerts;
  
      let criticalCount = 0;
      let lastCriticalDate = null;
  
      readings.forEach(reading => {
        if (reading.nivel <= criticalLevel) {
          criticalCount++;
          lastCriticalDate = reading.fecha;
        }
      });
  
      if (criticalCount >= this.CRITICAL_LEVEL_FREQUENCY) {
        alerts.push({
          tipo: 'FRECUENCIA_CRITICA',
          mensaje: `Nivel crítico alcanzado ${criticalCount} veces en el período`,
          fecha: lastCriticalDate,
          severidad: 'ALTA',
          detalles: {
            frecuencia: criticalCount,
            nivelCritico: criticalLevel
          }
        });
      }
  
      return alerts;
    }
  
    /**
     * Detecta todas las tendencias disponibles
     * @param {Object} data - Objeto con lecturas y reposiciones
     * @returns {Array} Todas las alertas detectadas
     */
    static analyzeAllTrends(data) {
      const { readings, refills } = data;
      
      const consumptionAlerts = this.detectConsumptionTrends(readings);
      const refillAlerts = this.detectRefillPatterns(refills);
      const criticalAlerts = this.detectCriticalLevelFrequency(readings);
  
      return [
        ...consumptionAlerts,
        ...refillAlerts,
        ...criticalAlerts
      ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }
  
    // Funciones auxiliares
    static calculateAverage(numbers) {
      return numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
    }
  
    static calculateStandardDeviation(numbers, mean) {
      const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numbers.length;
      return Math.sqrt(variance);
    }
  
    static groupRefillsByDay(refills) {
      return refills.reduce((acc, refill) => {
        const date = new Date(refill.fecha).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
    }
  }
  
  export default TrendDetectionService;