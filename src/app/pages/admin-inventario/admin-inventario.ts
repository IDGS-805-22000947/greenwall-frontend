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

  nuevaEntrada = {
    materialId: 0,
    cantidad: 1,
    costoUnitario: 0
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
    this.nuevaEntrada.materialId = materialId;
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

  registrarEntrada(): void {
    if (this.nuevaEntrada.cantidad <= 0 || this.nuevaEntrada.costoUnitario <= 0) {
      Swal.fire('Datos Inválidos', 'La cantidad y el costo deben ser mayores a cero.', 'error');
      return;
    }
    this.inventarioService.registrarEntrada(this.nuevaEntrada).subscribe(() => {
      Swal.fire({
        title: '¡Éxito!',
        text: 'La entrada de inventario ha sido registrada.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      this.cargarHistorial();
      this.nuevaEntrada.cantidad = 1;
      this.nuevaEntrada.costoUnitario = 0;
    });
  }
}
