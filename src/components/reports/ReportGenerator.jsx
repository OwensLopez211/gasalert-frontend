import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import axios from 'axios';

class ReportGenerator {
  constructor() {
    this.doc = null;
    this.currentPage = null;
    this.yOffset = 0;
    this.margins = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    };
  }

  async initialize() {
    this.doc = await PDFDocument.create();
    this.addNewPage();
    await this.embedFonts();
  }

  async embedFonts() {
    this.regularFont = await this.doc.embedFont(StandardFonts.Helvetica);
    this.boldFont = await this.doc.embedFont(StandardFonts.HelveticaBold);
  }

  addNewPage() {
    this.currentPage = this.doc.addPage();
    this.yOffset = this.currentPage.getHeight() - this.margins.top;
  }

  async generateReport(params) {
    try {
      // Fetch data from backend
      const data = await this.fetchReportData(params);
      await this.initialize();

      // Header Section
      await this.addHeader();

      // Dynamic Sections
      if (data.summary) await this.addExecutiveSummary(data.summary);
      if (data.tanks) await this.addTankStatusSection(data.tanks);
      if (data.alerts) await this.addAlertsSection(data.alerts);
      if (data.consumption) await this.addConsumptionAnalysis(data.consumption);
      if (data.metrics) await this.addPerformanceMetrics(data.metrics);
      if (data.trends) await this.addTrendsSection(data.trends);
      if (data.recommendations) await this.addRecommendations(data.recommendations);

      // Footer
      await this.addFooter();

      // Return the PDF as a Uint8Array
      return await this.doc.save();
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('Error al generar el reporte.');
    }
  }

  async fetchReportData(params) {
    try {
      const response = await axios.get('/reports/pdf/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching report data:', error);
      throw new Error('No se pudo obtener los datos del reporte.');
    }
  }

  async addHeader() {
    const { currentPage } = this;

    currentPage.drawText('Informe de Estado del Sistema', {
      x: this.margins.left,
      y: this.yOffset,
      size: 24,
      font: this.boldFont,
      color: rgb(0, 0, 0),
    });

    this.yOffset -= 40;

    const date = new Date().toLocaleDateString('es-CL');
    currentPage.drawText(`Fecha de generación: ${date}`, {
      x: this.margins.left,
      y: this.yOffset,
      size: 12,
      font: this.regularFont,
    });

    this.yOffset -= 30;
  }

  async addExecutiveSummary(summary) {
    this.currentPage.drawText('Resumen Ejecutivo', {
      x: this.margins.left,
      y: this.yOffset,
      size: 18,
      font: this.boldFont,
    });

    this.yOffset -= 20;

    const summaryText = `
      Estado general del sistema: ${summary.systemStatus}
      Total de tanques monitoreados: ${summary.totalTanks}
      Alertas activas: ${summary.activeAlerts}
      Eficiencia operativa: ${summary.efficiency}%
    `;

    await this.addWrappedText(summaryText, 12);
  }

  async addTankStatusSection(tanks) {
    const headers = ['Tanque', 'Nivel', 'Estado', 'Última Actualización'];
    const rows = tanks.map((tank) => [
      tank.name,
      `${tank.level}%`,
      tank.status,
      tank.lastUpdate,
    ]);

    await this.addTable(headers, rows);
  }

  async addAlertsSection(alerts) {
    const alertsByPriority = {
      high: alerts.filter((a) => a.priority === 'high'),
      medium: alerts.filter((a) => a.priority === 'medium'),
      low: alerts.filter((a) => a.priority === 'low'),
    };

    await this.addAlertsStats(alertsByPriority);
    await this.addRecentAlerts(alerts.slice(0, 5));
  }

  async addConsumptionAnalysis(consumption) {
    await this.addConsumptionGraphs(consumption);
    await this.addConsumptionStats(consumption);
  }

  async addPerformanceMetrics(metrics) {
    const kpis = [
      { label: 'Disponibilidad del Sistema', value: `${metrics.uptime}%` },
      { label: 'Precisión de Mediciones', value: `${metrics.accuracy}%` },
      { label: 'Tiempo de Respuesta', value: `${metrics.responseTime}ms` },
    ];

    await this.addKPISection(kpis);
  }

  async addTrendsSection(trends) {
    await this.addTrendGraphs(trends);
    await this.addPredictions(trends.predictions);
  }

  async addRecommendations(recommendations) {
    await this.addBulletList('Recomendaciones', recommendations);
  }

  async addFooter() {
    const pageCount = this.doc.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const page = this.doc.getPage(i);
      page.drawText(`Página ${i + 1} de ${pageCount}`, {
        x: page.getWidth() / 2,
        y: this.margins.bottom,
        size: 10,
        font: this.regularFont,
      });
    }
  }

  async addWrappedText(text, fontSize, maxWidth = 500) {
    // Implementation for text wrapping
    const lines = this.splitTextIntoLines(text, maxWidth);
    lines.forEach((line) => {
      this.currentPage.drawText(line, {
        x: this.margins.left,
        y: this.yOffset,
        size: fontSize,
        font: this.regularFont,
      });
      this.yOffset -= fontSize + 5;
    });
  }

  splitTextIntoLines(text, maxWidth) {
    // Logic for splitting text into lines
    return text.split(/\n/); // Basic implementation (replace with word-wrap logic if needed)
  }

  async addTable(headers, rows, options = {}) {
    // Implementation for creating tables (simplified)
    let y = this.yOffset;
    headers.forEach((header, index) => {
      this.currentPage.drawText(header, {
        x: this.margins.left + index * 100,
        y,
        size: 12,
        font: this.boldFont,
      });
    });
    y -= 20;
    rows.forEach((row) => {
      row.forEach((cell, index) => {
        this.currentPage.drawText(cell, {
          x: this.margins.left + index * 100,
          y,
          size: 10,
          font: this.regularFont,
        });
      });
      y -= 15;
    });
  }

  async addAlertsStats(alertsByPriority) {
    // Implementation for alerts statistics
  }

  async addRecentAlerts(alerts) {
    // Implementation for recent alerts list
  }

  async addConsumptionGraphs(consumption) {
    // Implementation for consumption graphs
  }

  async addConsumptionStats(consumption) {
    // Implementation for consumption statistics
  }

  async addKPISection(kpis) {
    // Implementation for key performance indicators
  }

  async addTrendGraphs(trends) {
    // Implementation for trend graphs
  }

  async addPredictions(predictions) {
    // Implementation for predictions
  }

  async addBulletList(title, items) {
    // Implementation for bullet lists
  }
}

export default ReportGenerator;