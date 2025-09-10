import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-productos.html',
})
export class AdminProductosComponent implements OnInit {
  productos: Producto[] = [];
  productoForm: FormGroup;
  modoEdicion = false;
  productoIdActual: number | null = null;

  constructor(private fb: FormBuilder, private productoService: ProductoService) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      imagenUrl: [''],
      unidadDeVenta: ['m²', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe(data => this.productos = data);
  }

  abrirModal(producto?: Producto): void {
    if (producto) {
      this.modoEdicion = true;
      this.productoIdActual = producto.id;
      this.productoForm.patchValue(producto);
    } else {
      this.modoEdicion = false;
      this.productoIdActual = null;
      this.productoForm.reset();
    }
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) return;

    const data = this.productoForm.value;
    const request = this.modoEdicion && this.productoIdActual
      ? this.productoService.updateProducto(this.productoIdActual, data)
      : this.productoService.createProducto(data);

    request.subscribe(() => {
      Swal.fire('¡Éxito!', 'El producto ha sido guardado.', 'success');
      this.cargarProductos(); 
    });
  }



  eliminarProducto(id: number, nombre: string): void {
    Swal.fire({
      title: `¿Eliminar "${nombre}"?`,
      text: "Esta acción no se puede revertir. Se eliminarán también todas las recetas asociadas a este producto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProducto(id).subscribe(() => {
          Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
          this.cargarProductos(); // Recarga la lista
        });
      }
    });

  }
}