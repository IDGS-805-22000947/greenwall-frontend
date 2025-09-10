
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-admin-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-ventas.html',
})
export class AdminVentasComponent implements OnInit {
  ventas: any[] = [];
  cargando = true;

  constructor(private ventaService: VentaService) { }

  ngOnInit(): void {
    this.ventaService.getTodasLasVentas().subscribe(data => {
      this.ventas = data;
      this.cargando = false;
    });
  }
}