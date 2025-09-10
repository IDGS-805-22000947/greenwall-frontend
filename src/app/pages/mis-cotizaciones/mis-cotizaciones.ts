// src/app/pages/mis-cotizaciones/mis-cotizaciones.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; 
import { CotizacionService } from '../../services/cotizacion.service';
import { MisCotizaciones } from '../../models/mis-cotizaciones.model'; 
import { VentaService } from '../../services/venta.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-cotizaciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-cotizaciones.html', 
})
export class MisCotizacionesComponent implements OnInit {
  cotizaciones: MisCotizaciones[] = []; // <-- Usa el nuevo modelo
  cargando = true;

  constructor(
    private cotizacionService: CotizacionService,
    private ventaService: VentaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCotizaciones();
  }

  cargarCotizaciones(): void {
    this.cargando = true;
    this.cotizacionService.getMisCotizaciones().subscribe(data => {
      this.cotizaciones = data;
      this.cargando = false;
    });
  }

  realizarCompra(cotizacionId: number): void {
    Swal.fire({
      title: '¿Confirmar Compra?',
      text: "Esto registrará tu pedido y descontará el material del inventario.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, ¡comprar ahora!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ventaService.crearVenta(cotizacionId).subscribe({
          next: (res) => {
            Swal.fire('¡Compra Exitosa!', res.message, 'success');
            this.cargarCotizaciones(); // Recarga la lista actual
          },
          error: (err) => Swal.fire('Error', err.error, 'error')
        });
      }
    });
  }
}