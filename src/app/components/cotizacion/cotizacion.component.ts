import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CotizacionService } from '../../services/cotizacion.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cotizacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Añadimos RouterLink para el enlace
  templateUrl: './cotizacion.component.html',
})
export class CotizacionComponent {
  peticion = { productoId: 1, metrosCuadrados: 10 };
  resultado: any = null;
  cargando = false;
  error: string | null = null;
  confirmado = false;

  constructor(
    private cotizacionService: CotizacionService,
    public authService: AuthService,
    private router: Router
  ) {}

  calcular(): void {
    this.cargando = true;
    this.resultado = null;
    this.error = null;
    this.confirmado = false;
    
    // Se llama al método correcto
    this.cotizacionService.previsualizarCotizacion(this.peticion).subscribe({
      next: (data: any) => { // Se añade el tipo 'any' para solucionar el error
        this.resultado = data;
        this.cargando = false;
      },
      error: (err: any) => { // Se añade el tipo 'any'
        this.error = "Hubo un error al calcular. Intenta de nuevo.";
        this.cargando = false;
      }
    });
  }

  confirmar(): void {
    if (!this.authService.isLoggedIn()) {
      alert("Por favor, inicia sesión para confirmar tu cotización.");
      this.router.navigate(['/login']);
      return;
    }
    this.cargando = true;
    
    // Se llama al método correcto
    this.cotizacionService.confirmarCotizacion(this.peticion).subscribe({
      next: () => {
        this.cargando = false;
        this.confirmado = true;
        this.resultado = null;
      },
      error: (err: any) => { // Se añade el tipo 'any'
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