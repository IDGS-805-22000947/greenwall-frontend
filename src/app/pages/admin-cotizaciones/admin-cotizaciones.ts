import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CotizacionService } from '../../services/cotizacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-cotizaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-cotizaciones.html',
  styleUrls: ['./admin-cotizaciones.css']
})
export class AdminCotizacionesComponent implements OnInit {
  cotizaciones: any[] = [];
  cargando = true;
  error: string | null = null;
  
  cotizacionSeleccionada: any = null;
  motivoRechazo: string = '';

  constructor(private cotizacionService: CotizacionService) { }

  ngOnInit(): void {
    this.cargarCotizaciones();
  }

  cargarCotizaciones(): void {
    this.cargando = true;
    this.cotizacionService.obtenerTodasLasCotizaciones().subscribe({
      next: (data: any[]) => {
        this.cotizaciones = data;
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = "No se pudieron cargar las cotizaciones.";
        this.cargando = false;
        console.error(err);
      }
    });
  }

  abrirModalRechazo(cotizacion: any): void {
    this.cotizacionSeleccionada = cotizacion;
    this.motivoRechazo = '';
  }

  confirmarRechazo(): void {
    if (!this.motivoRechazo) {
      Swal.fire('Atención', 'Por favor, escribe un motivo para el rechazo.', 'warning');
      return;
    }
    this.cotizacionService.rechazarCotizacion(this.cotizacionSeleccionada.id, this.motivoRechazo).subscribe({
      next: () => {
        Swal.fire('Rechazada', 'La cotización ha sido marcada como rechazada.', 'success');
        this.cargarCotizaciones();
      },
      error: (err: any) => {
        Swal.fire('Error', err.error.message || 'Error desconocido al rechazar.', 'error');
      }
    });
  }

  aprobarCotizacion(id: number): void {
    Swal.fire({
      title: '¿Aprobar Cotización?',
      text: "Esta acción registrará la salida de inventario y no se puede deshacer.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cotizacionService.aprobarCotizacion(id).subscribe({
          next: () => {
            Swal.fire('¡Aprobada!', 'La cotización ha sido aprobada y el inventario actualizado.', 'success');
            this.cargarCotizaciones();
          },
          error: (err: any) => {
            Swal.fire('Error al Aprobar', err.error.message || 'Stock insuficiente o error desconocido', 'error');
          }
        });
      }
    });
  }
}
