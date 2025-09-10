// src/app/pages/admin-documentos.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-documentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-documentos.html',
})
export class AdminDocumentosComponent implements OnInit {
  productos: Producto[] = [];
  documentosForm: FormGroup;
  productoSeleccionado: Producto | null = null;
  cargando = true;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {
    this.documentosForm = this.fb.group({
      manualUrl: [''],
      documentacionUrl: ['']
    });
  }

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
      this.cargando = false;
    });
  }

  onProductoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const productoId = Number(selectElement.value);
    
    this.productoSeleccionado = this.productos.find(p => p.id === productoId) || null;

    if (this.productoSeleccionado) {
      this.documentosForm.patchValue({
        manualUrl: this.productoSeleccionado.manualUrl || '',
        documentacionUrl: this.productoSeleccionado.documentacionUrl || ''
      });
    } else {
      this.documentosForm.reset();
    }
  }

  guardarDocumentos(): void {
    if (!this.productoSeleccionado) {
      Swal.fire('Error', 'Debes seleccionar un producto primero.', 'error');
      return;
    }

    if (this.documentosForm.invalid) {
      return;
    }

    const id = this.productoSeleccionado.id;
    const urls = this.documentosForm.value;

    this.productoService.updateDocumentos(id, urls).subscribe({
      next: () => {
        Swal.fire('¡Guardado!', 'Las URLs de los documentos han sido actualizadas.', 'success');
        // Actualizar el objeto local para reflejar el cambio
        if(this.productoSeleccionado){
          this.productoSeleccionado.manualUrl = urls.manualUrl;
          this.productoSeleccionado.documentacionUrl = urls.documentacionUrl;
        }
      },
      error: () => Swal.fire('Error', 'No se pudieron guardar los cambios.', 'error')
    });
  }
}