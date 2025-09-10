// src/app/pages/admin-solicitudes.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, SolicitudPendiente } from '../../services/admin';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-solicitudes.html',
})
export class AdminSolicitudesComponent implements OnInit {
  solicitudes: SolicitudPendiente[] = [];
  cargando = true;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.cargando = true;
    this.adminService.getSolicitudesPendientes().subscribe(data => {
      this.solicitudes = data;
      this.cargando = false;
    });
  }

  aprobar(solicitud: SolicitudPendiente): void {
    Swal.fire({
      title: '¿Aprobar solicitud?',
      html: `Se enviarán las credenciales de acceso al correo:<br><b>${solicitud.email}</b>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, aprobar y notificar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.aprobarSolicitud(solicitud.id).subscribe({
          next: () => {
            Swal.fire('¡Aprobado!', 'El usuario ha sido activado y notificado por correo.', 'success');
            this.cargarSolicitudes(); // Recarga la lista para quitar la solicitud procesada
          },
          error: (err) => Swal.fire('Error', err.error.message || 'No se pudo aprobar la solicitud.', 'error')
        });
      }
    });
  }

  rechazar(solicitud: SolicitudPendiente): void {
     Swal.fire({
      title: '¿Rechazar esta solicitud?',
      html: `Se denegará el acceso permanentemente a <b>${solicitud.nombreCompleto}</b>.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.rechazarSolicitud(solicitud.id).subscribe({
            next: () => {
                Swal.fire('¡Rechazado!', 'La solicitud ha sido rechazada.', 'info');
                this.cargarSolicitudes(); // Recarga la lista
            },
            error: (err) => Swal.fire('Error', err.error.message || 'No se pudo rechazar la solicitud.', 'error')
        });
      }
    });
  }
}