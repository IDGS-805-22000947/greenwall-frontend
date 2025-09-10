import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValoracionesService } from '../../services/valoraciones';
import { Valoracion } from '../../models/valoracion.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-valoraciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-valoraciones.html',
})
export class AdminValoracionesComponent implements OnInit {
  valoracionesPendientes: Valoracion[] = [];

  constructor(private valoracionesService: ValoracionesService) {}

  ngOnInit(): void {
    this.cargarValoraciones();
  }

  cargarValoraciones(): void {
    // CORREGIDO: El método se llama getPendientes()
    this.valoracionesService.getPendientes().subscribe((data: Valoracion[]) => {
      this.valoracionesPendientes = data;
    });
  }

  aprobar(id: number): void {
    // CORREGIDO: El método se llama aprobar(id)
    this.valoracionesService.aprobar(id).subscribe(() => {
      Swal.fire('Aprobada', 'La opinión ha sido aprobada.', 'success');
      this.cargarValoraciones(); // Recargamos la lista
    });
  }

  rechazar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta opinión se eliminará permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // CORREGIDO: El método se llama rechazar(id)
        this.valoracionesService.rechazar(id).subscribe(() => {
          Swal.fire('Rechazada', 'La opinión ha sido eliminada.', 'success');
          this.cargarValoraciones(); // Recargamos la lista
        });
      }
    });
  }
}