import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProveedorService } from '../../services/proveedor.service';
import { MaterialesService } from '../../services/materiales'; // Asegúrate que la ruta sea correcta
import { CompraService } from '../../services/compra.service';
import { Proveedor } from '../../models/proveedor.model';
import { Material } from '../../models/material.model';
import { CompraVista } from '../../models/compra.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-gestion-proveedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './admin-gestion-proveedores.html',
  styleUrls: ['./admin-gestion-proveedores.css']
})
export class AdminGestionProveedoresComponent implements OnInit {
  // --- Propiedades para Proveedores ---
  proveedoresActivos: Proveedor[] = [];
  proveedoresInactivos: Proveedor[] = [];
  
  // --- ESTA ES LA DECLARACIÓN CORREGIDA ---
  proveedorForm: FormGroup<{
    nombre: FormControl<string | null>;
    rfc: FormControl<string | null>;
    email: FormControl<string | null>;
    telefono: FormControl<string | null>;
    direccion: FormControl<string | null>; // <-- SE AÑADIÓ LA DIRECCIÓN AQUÍ
  }>;
  
  modoEdicionProveedor = false;
  proveedorIdActual: number | null = null;

  // --- Propiedades para Materiales ---
  materialesActivos: any[] = [];
  materialesInactivos: any[] = [];
  materialForm: FormGroup;
  modoEdicionMaterial = false;
  materialIdActual: number | null = null;
  
  // --- Propiedades para Asociaciones y Compras ---
  proveedoresParaAsociar: Proveedor[] = [];
  materialesMaestro: any[] = [];
  proveedorSeleccionadoId: number | null = null;
  materialesAsociadosIds: Set<number> = new Set();
  historialCompras: CompraVista[] = [];

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private materialesService: MaterialesService,
    private compraService: CompraService
  ) {
    // La inicialización ahora coincide perfectamente con la declaración de arriba
    this.proveedorForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    rfc: ['', [
      Validators.required, 
      Validators.minLength(13), 
      Validators.maxLength(13),
      Validators.pattern('^[A-Z0-9]*$') 
    ]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
    direccion: [''] 
  });

    this.materialForm = this.fb.group({
      nombre: ['', Validators.required],
      unidad: ['', Validators.required]
    });
  }


  toUpperCase(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      input.value = input.value.toUpperCase();
    }
  }

  // Getter para acceder fácilmente a los controles del formulario de proveedores
  get f() {
    return this.proveedorForm.controls;
  }

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarMateriales();
    this.cargarCompras();
  }

  // --- MÉTODOS PARA PROVEEDORES ---
  cargarProveedores(): void {
    this.proveedorService.getActivos().subscribe(p => {
      this.proveedoresActivos = p;
      this.proveedoresParaAsociar = p;
    });
    this.proveedorService.getInactivos().subscribe(p => this.proveedoresInactivos = p);
  }

  abrirModalProveedor(proveedor?: Proveedor): void {
    if (proveedor) {
      this.modoEdicionProveedor = true;
      this.proveedorIdActual = proveedor.id;
      this.proveedorForm.patchValue(proveedor);
    } else {
      this.modoEdicionProveedor = false;
      this.proveedorIdActual = null;
      this.proveedorForm.reset();
    }
  }


  guardarProveedor(): void {
    if (this.proveedorForm.invalid) {
        this.proveedorForm.markAllAsTouched();
        return;
    }
    
    // Forzamos a que 'data' sea del tipo correcto que espera el servicio.
    const data = this.proveedorForm.value as Omit<Proveedor, 'id' | 'isActivo'>;

    const request = this.modoEdicionProveedor && this.proveedorIdActual
      // Para 'update', también hacemos la aserción de tipo.
      ? this.proveedorService.update(this.proveedorIdActual, { id: this.proveedorIdActual, ...data } as Omit<Proveedor, 'isActivo'>)
      : this.proveedorService.create(data);
    
    request.subscribe({
        next: () => this.recargarDatos('proveedores'),
        error: (err) => Swal.fire('Error', err.error?.title || 'No se pudo guardar el proveedor.', 'error')
    });
  }

  desactivarProveedor(id: number): void {
    Swal.fire({
      title: '¿Desactivar Proveedor?', text: "Este proveedor no aparecerá en nuevas compras.",
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, desactivar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.desactivar(id).subscribe(() => this.recargarDatos('proveedores'));
      }
    });
  }

  reactivarProveedor(id: number): void {
    this.proveedorService.reactivar(id).subscribe({
      next: () => this.recargarDatos('proveedores'),
      error: (err) => Swal.fire('Error', err.error, 'error')
    });
  }
  
  // --- MÉTODOS PARA MATERIALES ---
  cargarMateriales(): void {
    this.materialesService.getMaterialesConStock().subscribe(data => {
      this.materialesActivos = data.filter(m => m.isActivo);
      this.materialesInactivos = data.filter(m => !m.isActivo);
      this.materialesMaestro = data;
    });
  }

  abrirModalMaterial(material?: Material): void {
    if (material) {
      this.modoEdicionMaterial = true;
      this.materialIdActual = material.id;
      this.materialForm.patchValue(material);
    } else {
      this.modoEdicionMaterial = false;
      this.materialIdActual = null;
      this.materialForm.reset();
    }
  }

  guardarMaterial(): void {
    if (this.materialForm.invalid) return;
    const data = this.materialForm.value;
    const request = this.modoEdicionMaterial && this.materialIdActual
      ? this.materialesService.updateMaterial(this.materialIdActual, { id: this.materialIdActual, ...data })
      : this.materialesService.addMaterial(data);
      
    request.subscribe({
        next: () => this.recargarDatos('materiales'),
        error: (err) => Swal.fire('Error', err.error?.title || 'No se pudo guardar el material.', 'error')
    });
  }

  desactivarMaterial(id: number): void {
    Swal.fire({
      title: '¿Desactivar Material?', text: "No podrás usarlo en nuevas compras o recetas.",
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, desactivar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.materialesService.desactivarMaterial(id).subscribe(() => this.recargarDatos('materiales'));
      }
    });
  }

  reactivarMaterial(id: number): void {
    this.materialesService.reactivarMaterial(id).subscribe({
      next: () => this.recargarDatos('materiales'),
      error: (err) => Swal.fire('Error', err.error, 'error')
    });
  }
  
  // --- MÉTODOS PARA ASOCIAR MATERIALES ---
  onProveedorSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const id = parseInt(selectElement.value, 10);
    if (isNaN(id)) {
      this.proveedorSeleccionadoId = null;
      this.materialesAsociadosIds.clear();
      return;
    }
    this.proveedorSeleccionadoId = id;
    this.proveedorService.getMaterialesIdsPorProveedor(id).subscribe(ids => {
      this.materialesAsociadosIds = new Set(ids);
    });
  }

  onMaterialToggle(materialId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.materialesAsociadosIds.add(materialId);
    } else {
      this.materialesAsociadosIds.delete(materialId);
    }
  }

  guardarAsociaciones(): void {
    if (!this.proveedorSeleccionadoId) return;
    const idsParaGuardar = Array.from(this.materialesAsociadosIds);
    this.proveedorService.actualizarMaterialesProveedor(this.proveedorSeleccionadoId, idsParaGuardar)
      .subscribe({
        next: () => Swal.fire('¡Éxito!', 'Se guardaron las asociaciones de materiales.', 'success'),
        error: () => Swal.fire('Error', 'No se pudieron guardar los cambios.', 'error')
      });
  }

  // --- MÉTODOS PARA COMPRAS ---
  cargarCompras(): void {
    this.compraService.getCompras().subscribe(data => this.historialCompras = data);
  }
  
  // --- UTILIDADES ---
  recargarDatos(tipo: 'proveedores' | 'materiales'): void {
    const tipoTexto = tipo === 'proveedores' ? 'La lista de proveedores' : 'El catálogo de materiales';
    Swal.fire('¡Éxito!', `${tipoTexto} ha sido actualizado.`, 'success');
    if (tipo === 'proveedores') this.cargarProveedores();
    if (tipo === 'materiales') this.cargarMateriales();
  }
}