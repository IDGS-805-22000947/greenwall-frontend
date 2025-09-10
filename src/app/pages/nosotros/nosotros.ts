// src/app/pages/nosotros/nosotros.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
// AÑADIDO: Imports para Reactive Forms
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProductoService } from '../../services/producto';
import { ValoracionesService } from '../../services/valoraciones';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Producto } from '../../models/producto.model';
// AÑADIDO: Imports para los nuevos modelos de valoración
import { Valoracion, EstadoMiValoracion } from '../../models/valoracion.model';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  // AÑADIDO: ReactiveFormsModule a los imports
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nosotros.html',
  styleUrls: ['./nosotros.css']
})
export class NosotrosComponent implements OnInit, OnDestroy {
  // Propiedades de Autenticación (sin cambios)
  isLoggedIn = false;
  isCliente = false;
  private authSubscription: Subscription = new Subscription();

  // Propiedades del Producto (sin cambios)
  producto: Producto | null = null;
  videoUrlSeguro: SafeResourceUrl | null = null;
  cargando = true;
  productoId = 1;

  // --- LÓGICA DE VALORACIONES ACTUALIZADA ---
  valoracionesAprobadas: Valoracion[] = [];
  estadoMiValoracion: EstadoMiValoracion | null = null;
  valoracionForm: FormGroup;

  constructor(
    private productoService: ProductoService,
    private valoracionesService: ValoracionesService,
    public authService: AuthService, // Público para usarlo en el HTML
    private sanitizer: DomSanitizer,
    private fb: FormBuilder // AÑADIDO: FormBuilder
  ) {
    // AÑADIDO: Inicialización del formulario reactivo
    this.valoracionForm = this.fb.group({
      calificacion: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    // 1. Suscribirse a los cambios de autenticación
    this.authSubscription.add(
      this.authService.isLoggedIn$.subscribe(status => {
        this.isLoggedIn = status;
        this.isCliente = this.authService.getUserRole() === 'Cliente';
        // Si el estado de login cambia, verificamos si puede valorar
        if (this.isCliente) {
          this.verificarEstadoValoracion();
        } else {
          this.estadoMiValoracion = null;
        }
      })
    );

    // 2. Cargar la información del producto (sin cambios)
    this.productoService.getProducto(this.productoId).subscribe(data => {
      this.producto = data;
      if (this.producto?.videoUrl) {
        this.videoUrlSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(this.producto.videoUrl);
      }
      this.cargando = false;
    });

    // 3. Cargar las valoraciones públicas APROBADAS
    this.cargarValoracionesAprobadas();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  // --- MÉTODOS DE VALORACIÓN ACTUALIZADOS ---
  cargarValoracionesAprobadas(): void {
    // CORREGIDO: Llama al nuevo método del servicio
    this.valoracionesService.getAprobadas().subscribe(data => {
      this.valoracionesAprobadas = data;
    });
  }

  verificarEstadoValoracion(): void {
    // CORREGIDO: Llama al nuevo método del servicio
    this.valoracionesService.getMiEstado().subscribe(res => {
      this.estadoMiValoracion = res;
    });
  }

  setCalificacion(calificacion: number): void {
    // Actualiza el valor en el formulario reactivo
    this.valoracionForm.get('calificacion')?.setValue(calificacion);
  }

  enviarOpinion(): void {
    if (this.valoracionForm.invalid) {
      Swal.fire('Atención', 'Por favor, selecciona una calificación y escribe un comentario.', 'warning');
      return;
    }
    this.valoracionesService.crear(this.valoracionForm.value).subscribe({
      next: (res: any) => {
        Swal.fire('¡Gracias por tu opinión!', res.message, 'success');
        this.verificarEstadoValoracion(); // Actualizamos el estado para mostrar el mensaje de "ya opinaste"
        this.valoracionForm.reset({ calificacion: 0 });
      },
      error: (err: any) => {
        Swal.fire('Error', err.error, 'error');
      }
    });
  }
}