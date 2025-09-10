import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CotizacionService } from '../../services/cotizacion.service';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto.model';
import { PeticionCotizacion, ResultadoCotizacion } from '../../models/cotizacion.model';

@Component({
  selector: 'app-cotizacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cotizacion.component.html',
})
export class CotizacionComponent implements OnInit {
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null; // Para saber qué campo mostrar
  peticion: PeticionCotizacion = { productoId: 0, metrosCuadrados: 10, cantidadUnidades: 1 };
  resultado: ResultadoCotizacion | null = null;
  cargando = false;
  error: string | null = null;
  confirmado = false;

  constructor(
    private cotizacionService: CotizacionService,
    public authService: AuthService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
      if (this.productos.length > 0) {
        // --- ESTA ES LA CORRECCIÓN CLAVE ---
        // Llamamos a onProductoChange para inicializar el estado
        this.onProductoChange(this.productos[0].id);
      }
    });
  }

  // Esta función ahora se encarga de actualizar todo cuando cambia el producto
  onProductoChange(productoId: number): void {
    this.productoSeleccionado = this.productos.find(p => p.id === Number(productoId)) || null;
    if (this.productoSeleccionado) {
      this.peticion.productoId = this.productoSeleccionado.id;
    }
    // Reseteamos cualquier cálculo anterior al cambiar de producto
    this.resultado = null;
    this.error = null;
    this.confirmado = false;
  }

  calcular(): void {
    this.cargando = true;
    this.resultado = null;
    this.error = null;
    this.confirmado = false;
    
    this.cotizacionService.previsualizarCotizacion(this.peticion).subscribe({
      next: (data) => {
        this.resultado = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = "Hubo un error al calcular. Verifica que el producto tenga una receta activa.";
        this.cargando = false;
      }
    });
  }

  confirmar(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargando = true;
    
    this.cotizacionService.confirmarCotizacion(this.peticion).subscribe({
      next: () => {
        this.cargando = false;
        this.confirmado = true;
        this.resultado = null;
      },
      error: (err) => {
        this.error = "Error al confirmar la cotización. Inténtalo de nuevo.";
        this.cargando = false;
      }
    });
  }

  cancelar(): void {
    this.peticion.metrosCuadrados = 10;
    this.resultado = null;
    this.error = null;
    this.confirmado = false;
  }
}