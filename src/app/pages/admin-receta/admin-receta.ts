import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RecetaService } from '../../services/receta';
import { MaterialesService } from '../../services/materiales';
import { ProductoService } from '../../services/producto';
import { Receta } from '../../models/receta.model';
import { Producto } from '../../models/producto.model';
import { Material } from '../../models/material.model';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-receta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-receta.html',
})
export class AdminRecetaComponent implements OnInit {
  // --- Pestaña 1: Gestión de Recetas ---
  productos: Producto[] = [];
  recetasDelProducto: Receta[] = [];
  productoSeleccionadoId: number | null = null;
  recetaForm: FormGroup;
  modoEdicionReceta = false;

  // --- Pestaña 2: Editor de Receta ---
  recetaParaEditar: Receta | null = null;
  editorForm: FormGroup;
  catalogoMateriales: Material[] = [];

  constructor(
    private fb: FormBuilder,
    private recetaService: RecetaService,
    private materialesService: MaterialesService,
    private productoService: ProductoService
  ) {
    this.recetaForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: [''],
      productoId: [null, Validators.required]
    });

    this.editorForm = this.fb.group({
      detalles: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(data => this.productos = data);
    this.materialesService.getMaterialesActivos().subscribe(data => this.catalogoMateriales = data);
  }

  // --- Lógica para Pestaña 1 ---
  onProductoSelect(event: Event): void {
    const id = parseInt((event.target as HTMLSelectElement).value, 10);
    if (isNaN(id)) {
      this.productoSeleccionadoId = null;
      this.recetasDelProducto = [];
      return;
    }
    this.productoSeleccionadoId = id;
    this.cargarRecetas(id);
  }

  cargarRecetas(productoId: number): void {
    this.recetaService.getRecetasPorProducto(productoId).subscribe(data => {
      this.recetasDelProducto = data;
    });
  }

  abrirModalReceta(receta?: Receta): void {
    if (receta) {
      this.modoEdicionReceta = true;
      this.recetaForm.patchValue(receta);
    } else {
      this.modoEdicionReceta = false;
      this.recetaForm.reset({ productoId: this.productoSeleccionadoId });
    }
  }

  guardarReceta(): void {
    if (this.recetaForm.invalid) return;

    const recetaData = this.recetaForm.value;
    let request: Observable<any>;

    if (this.modoEdicionReceta) {
      // Si estamos en modo edición, usamos el servicio de ACTUALIZAR
      const id = this.recetaForm.value.id;
      request = this.recetaService.updateReceta(id, recetaData);
    } else {
      // Si no, usamos el servicio de CREAR
      request = this.recetaService.crearReceta(recetaData);
    }

    request.subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'La receta ha sido guardada.', 'success');
        if (this.productoSeleccionadoId) this.cargarRecetas(this.productoSeleccionadoId);
      },
      error: (err) => Swal.fire('Error', err.error, 'error')
    });
  }

  // --- Lógica para Pestaña 2 ---
  get detalles(): FormArray {
    return this.editorForm.get('detalles') as FormArray;
  }

  // CORREGIDO: Lógica movida del HTML al TS
  onRecetaSelect(event: Event): void {
    const id = parseInt((event.target as HTMLSelectElement).value, 10);
    if (isNaN(id)) {
      this.recetaParaEditar = null;
      this.detalles.clear();
      return;
    }
    this.cargarDetallesParaEditar(id);
  }

   cargarDetallesParaEditar(recetaId: number): void {
    this.recetaService.getRecetaDetalle(recetaId).subscribe(recetaCompleta => {
      this.recetaParaEditar = recetaCompleta;
      this.detalles.clear();
      recetaCompleta.detalles?.forEach(detalle => {
        this.detalles.push(this.fb.group({
          materialId: [detalle.materialId, Validators.required],
          cantidad: [detalle.cantidad, [Validators.required, Validators.min(0.0001)]],
          alcance: [detalle.alcance]
        }));
      });
    });
  }

  agregarMaterial(): void {
    this.detalles.push(this.fb.group({
      materialId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(0.0001)]],
      alcance: [null] 
    }));
  }

  eliminarMaterial(index: number): void {
    this.detalles.removeAt(index);
  }

  guardarDetalles(): void {
    if (!this.recetaParaEditar || this.editorForm.invalid) return;
    
    this.recetaService.actualizarDetallesReceta(this.recetaParaEditar.id, this.editorForm.value.detalles)
      .subscribe(() => {
        Swal.fire('¡Guardado!', 'La lista de materiales ha sido actualizada.', 'success');
      });
  }
  
  // CORREGIDO: Función de ayuda para obtener la unidad del material
  getMaterialUnit(detalleControl: AbstractControl): string {
    const materialId = detalleControl.get('materialId')?.value;
    if (!materialId) return '';
    
    const material = this.catalogoMateriales.find(m => m.id === materialId);
    return material ? material.unidad : '';
  }


   activarReceta(recetaId: number): void {
    this.recetaService.activarReceta(recetaId).subscribe(() => {
      Swal.fire('¡Éxito!', 'La receta ha sido establecida como activa.', 'success');
      // Recargamos la lista para ver el cambio de estado reflejado
      if (this.productoSeleccionadoId) {
        this.cargarRecetas(this.productoSeleccionadoId);
      }
    });
  }

   desactivarReceta(receta: Receta): void {
    if (!receta.isActiva) return; // No hacer nada si ya está inactiva
    
    this.recetaService.desactivarReceta(receta.id).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'La receta ha sido desactivada.', 'success');
        if (this.productoSeleccionadoId) this.cargarRecetas(this.productoSeleccionadoId);
      },
      error: (err) => Swal.fire('Error', err.error, 'error')
    });
  }

}