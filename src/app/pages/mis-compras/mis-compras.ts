// src/app/pages/mis-compras/mis-compras.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VentaService } from '../../services/venta.service'; // Asegúrate que la ruta sea correcta

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-compras.html',
})
export class MisComprasComponent implements OnInit {
  compras: any[] = [];
  cargando = true;

  constructor(private ventaService: VentaService) { }

  ngOnInit(): void {
    this.ventaService.getMisCompras().subscribe(data => {
      this.compras = data;
      this.cargando = false;
    });
  }
}