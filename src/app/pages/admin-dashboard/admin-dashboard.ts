import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// CAMBIO AQUÍ: Importamos la directiva en lugar del módulo
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DashboardService, DashboardData } from '../../services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  // CAMBIO AQUÍ: Usamos la directiva en el array de imports
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'] // Es buena práctica añadir el archivo de estilos
})
export class AdminDashboardComponent implements OnInit {
  public data: DashboardData | null = null;

  // Propiedades para la gráfica de barras
  public barChartData: ChartConfiguration<'bar'>['data'] | null = null;
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe(apiData => {
      this.data = apiData;

      // Configuramos los datos para la gráfica una vez que los recibimos
      this.barChartData = {
        labels: apiData.comprasUltimos6Meses.map(c => c.mes),
        datasets: [
          {
            data: apiData.comprasUltimos6Meses.map(c => c.total),
            label: 'Total de Compras ($)',
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Color de fondo de las barras
            borderColor: 'rgba(54, 162, 235, 1)',     // Color del borde de las barras
            borderWidth: 1
          }
        ]
      };
    });
  }
}