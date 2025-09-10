import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

// Models
import { CompraVista } from '../../models/compra.model';
import { Proveedor } from '../../models/proveedor.model';
import { Material } from '../../models/material.model'; // Asegúrate que este archivo exista

// Services
import { CompraService } from '../../services/compra.service';
import { ProveedorService } from '../../services/proveedor.service';
import { MaterialesService } from '../../services/materiales'; // <-- CORREGIDO: El nombre del servicio y el archivo

@Component({
  selector: 'app-admin-compras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-compras.html',
})
export class AdminComprasComponent implements OnInit {
  vistaActual: 'lista' | 'formulario' = 'lista';
  compras: CompraVista[] = [];
  proveedores: Proveedor[] = [];
  materiales: Material[] = []; // Catálogo de materiales para el select
  
  compraForm: FormGroup;
  cargando = true;

  constructor(
    private compraService: CompraService,
    private proveedorService: ProveedorService,
    private materialService: MaterialesService, // <-- CORREGIDO: El tipo de la inyección
    private fb: FormBuilder,
    private router: Router
  ) {
    this.compraForm = this.fb.group({
      proveedorId: ['', Validators.required],
      detalles: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  ngOnInit(): void {
    this.cargarCompras();
    this.cargarCatalogos();
  }

  cargarCompras(): void {
    this.cargando = true;
    this.compraService.getCompras().subscribe(data => {
      this.compras = data;
      this.cargando = false;
    });
  }

  cargarCatalogos(): void {
    this.proveedorService.getActivos().subscribe(data => this.proveedores = data);
    this.materialService.getMaterialesActivos().subscribe(data => { // <-- CORREGIDO: El nombre del método
      this.materiales = data;
    });
  }

  // Métodos para el FormArray de detalles
  get detalles(): FormArray {
    return this.compraForm.get('detalles') as FormArray;
  }

  nuevoDetalle(): FormGroup {
    return this.fb.group({
      materialId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      costoUnitario: [0.01, [Validators.required, Validators.min(0.01)]]
    });
  }

  agregarDetalle(): void {
    this.detalles.push(this.nuevoDetalle());
  }

  removerDetalle(index: number): void {
    this.detalles.removeAt(index);
  }

  cambiarVista(vista: 'lista' | 'formulario'): void {
    this.vistaActual = vista;
    if (vista === 'formulario') {
      this.compraForm.reset();
      this.detalles.clear();
      this.agregarDetalle(); // Inicia con una fila
    }
  }

  guardarCompra(): void {
    if (this.compraForm.invalid) {
      this.compraForm.markAllAsTouched();
      Swal.fire('Formulario inválido', 'Por favor, completa todos los campos requeridos.', 'error');
      return;
    }

    this.compraService.create(this.compraForm.value).subscribe({
      next: () => {
        Swal.fire('¡Compra Registrada!', 'La compra y el inventario han sido actualizados.', 'success');
        this.cargarCompras();
        this.cambiarVista('lista');
      },
      error: (err) => Swal.fire('Error', err.error.message || 'Ocurrió un error al registrar la compra', 'error')
    });
  }

  verDetalle(id: number): void {
    // Esta función está lista para que en el futuro implementes un modal o una página de detalle.
    // Por ahora, no hace nada visible, pero podrías usar un alert o un console.log para probar.
    alert(`Se mostrarían los detalles de la compra #${id}`);
  }
}