
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialesService } from '../../services/materiales'; 
import { InventarioService } from '../../services/inventario'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-inventario.html',
  styleUrls: ['./admin-inventario.css']
})
export class AdminInventarioComponent implements OnInit {
  materiales: any[] = [];
  historial: any[] = [];
  materialSeleccionadoId: number | null = null;
  cargandoHistorial = false;

  nuevoAjuste = {
    materialId: 0,
    cantidad: 0,
    motivo: ''
  };

  constructor(
    private materialesService: MaterialesService,
    private inventarioService: InventarioService
  ) { }

  ngOnInit(): void {
    this.materialesService.getMaterialesActivos().subscribe((data: any[]) => {
      this.materiales = data;
    });
  }

  onMaterialSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const materialId = parseInt(selectElement.value, 10);
    
    if (isNaN(materialId)) {
      this.historial = [];
      this.materialSeleccionadoId = null;
      return;
    }
    
    this.materialSeleccionadoId = materialId;
    this.nuevoAjuste.materialId = materialId; // Prepara el objeto de ajuste
    this.cargarHistorial();
  }
  
  cargarHistorial(): void {
    if (!this.materialSeleccionadoId) return;
    this.cargandoHistorial = true;
    this.inventarioService.getHistorialMaterial(this.materialSeleccionadoId).subscribe((data: any[]) => {
      this.historial = data;
      this.cargandoHistorial = false;
    });
  }

  realizarAjuste(): void {
    if (this.nuevoAjuste.cantidad === 0) {
      Swal.fire('Dato Inválido', 'La cantidad no puede ser cero.', 'error');
      return;
    }
    if (!this.nuevoAjuste.motivo || this.nuevoAjuste.motivo.trim().length < 5) {
      Swal.fire('Dato Inválido', 'Debes proporcionar un motivo de al menos 5 caracteres.', 'error');
      return;
    }

    this.inventarioService.realizarAjuste(this.nuevoAjuste).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'El ajuste de inventario ha sido registrado.', 'success');
        this.cargarHistorial();
        // Resetea el formulario de ajuste
        this.nuevoAjuste.cantidad = 0;
        this.nuevoAjuste.motivo = '';
      },
      error: (err) => {
        Swal.fire('Error', err.error, 'error');
      }
    });
  }
}