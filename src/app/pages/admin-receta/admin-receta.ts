import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecetaService } from '../../services/receta';
import { MaterialesService } from '../../services/materiales';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-receta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-receta.html',
})
export class AdminRecetaComponent implements OnInit {
  receta: any[] = [];
  materialesCatalogo: any[] = [];
  materialesDisponibles: any[] = [];
  cargando = true;
  productoId = 1;
  
  nuevoIngrediente = { materialId: null, cantidadPorM2: 1 };

  constructor(
    private recetaService: RecetaService,
    private materialesService: MaterialesService
  ) {}

  ngOnInit(): void {
    this.materialesService.getMaterialesActivos().subscribe((data: any[]) => {
      this.materialesCatalogo = data;
      this.cargarReceta();
    });
  }

  cargarReceta(): void {
    this.cargando = true;
    this.recetaService.getReceta(this.productoId).subscribe((data: any[]) => {
      this.receta = data;
      this.filtrarMaterialesDisponibles();
      this.cargando = false;
    });
  }

  filtrarMaterialesDisponibles(): void {
    const idsEnReceta = new Set(this.receta.map(item => item.materialId));
    this.materialesDisponibles = this.materialesCatalogo.filter(m => !idsEnReceta.has(m.id));
  }

  agregarIngrediente(): void {
    if (!this.nuevoIngrediente.materialId || this.nuevoIngrediente.cantidadPorM2 <= 0) {
      Swal.fire('Atención', 'Selecciona un material y una cantidad válida.', 'warning');
      return;
    }
    
    this.recetaService.addIngrediente(this.productoId, this.nuevoIngrediente).subscribe({
      next: () => {
        this.cargarReceta();
        this.nuevoIngrediente = { materialId: null, cantidadPorM2: 1 };
      },
      error: (err: any) => {
        const errorMessage = err.error && typeof err.error === 'string' 
          ? err.error 
          : 'Ocurrió un error al agregar el material.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  eliminarIngrediente(materialId: number): void {
    Swal.fire({
      title: '¿Quitar de la receta?',
      text: "El material será eliminado de la fórmula de m².",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.recetaService.deleteIngrediente(this.productoId, materialId).subscribe(() => {
          this.cargarReceta();
        });
      }
    });
  }
}
