import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialesService } from '../../services/materiales';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-materials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-materials.html',
  styleUrls: ['./admin-materials.css']
})
export class AdminMaterialsComponent implements OnInit {
  materialesActivos: any[] = [];
  materialesInactivos: any[] = [];
  cargando = true;
  vistaActual: 'activos' | 'inactivos' = 'activos';
  
  materialSeleccionado: any = {};
  modoEdicion = false;

  constructor(private materialesService: MaterialesService) { }

  ngOnInit(): void {
    this.cargarMateriales();
  }

  cargarMateriales(): void {
    this.cargando = true;
    this.materialesService.getMaterialesActivos().subscribe((data: any[]) => {
      this.materialesActivos = data;
      this.cargando = false;
    });
    this.materialesService.getMaterialesInactivos().subscribe((data: any[]) => {
      this.materialesInactivos = data;
    });
  }

  cambiarVista(vista: 'activos' | 'inactivos'): void {
    this.vistaActual = vista;
  }

  abrirModal(material?: any): void {
    if (material) {
      this.materialSeleccionado = { ...material };
      this.modoEdicion = true;
    } else {
      this.materialSeleccionado = { nombre: '', unidad: '' };
      this.modoEdicion = false;
    }
  }

  guardarMaterial(): void {
    const operacion = this.modoEdicion
      ? this.materialesService.updateMaterial(this.materialSeleccionado.id, this.materialSeleccionado)
      : this.materialesService.addMaterial(this.materialSeleccionado);
      
    operacion.subscribe({
      next: () => {
        Swal.fire({
          title: '¡Guardado!',
          text: `El material "${this.materialSeleccionado.nombre}" ha sido guardado.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.cargarMateriales();
      },
      error: (err: any) => {
        Swal.fire('Error', err.error, 'error');
      }
    });
  }

  desactivar(id: number): void {
    Swal.fire({
      title: '¿Desactivar material?',
      text: "No aparecerá en las listas para nuevas recetas o entradas de inventario.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.materialesService.desactivarMaterial(id).subscribe(() => {
          Swal.fire('¡Desactivado!', 'El material ha sido movido a inactivos.', 'success');
          this.cargarMateriales();
        });
      }
    });
  }
  
  reactivar(id: number): void {
    Swal.fire({
      title: '¿Reactivar material?',
      text: "El material volverá a estar disponible en todo el sistema.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, reactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.materialesService.reactivarMaterial(id).subscribe(() => {
          Swal.fire('¡Reactivado!', 'El material ha sido movido a activos.', 'success');
          this.cargarMateriales();
        });
      }
    });
  }

  borrarPermanentemente(id: number, nombre: string): void {
    Swal.fire({
        title: `¿Eliminar "${nombre}"?`,
        html: `Esta acción es <b>irreversible</b> y borrará todo el historial de inventario y recetas asociado a este material.<br><br>Escribe "<b>BORRAR</b>" para confirmar.`,
        icon: 'error',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Eliminar Permanentemente',
        confirmButtonColor: '#dc3545',
        cancelButtonText: 'Cancelar',
        preConfirm: (confirmText) => {
            if (confirmText !== 'BORRAR') {
                Swal.showValidationMessage('Debes escribir "BORRAR" para confirmar la eliminación.');
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            this.materialesService.DeleteMaterialPermanentemente(id).subscribe(() => {
                Swal.fire('¡Eliminado!', `El material "${nombre}" ha sido eliminado.`, 'success');
                this.cargarMateriales();
            });
        }
    });
  }
}
