import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValoracionesService } from '../../services/valoraciones';
import { EstadoMiValoracion } from '../../models/valoracion.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-valoraciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Asegúrate de que ReactiveFormsModule está aquí
  templateUrl: './mis-valoraciones.html',
})
export class MisValoracionesComponent implements OnInit {
  estadoMiValoracion: EstadoMiValoracion | null = null;
  valoracionForm: FormGroup;

  constructor(
    private valoracionesService: ValoracionesService,
    private fb: FormBuilder
  ) {
    this.valoracionForm = this.fb.group({
      calificacion: [0, [Validators.required, Validators.min(1)]],
      comentario: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.verificarEstado();
  }

  verificarEstado(): void {
    this.valoracionesService.getMiEstado().subscribe(data => {
      this.estadoMiValoracion = data;
    });
  }

  setCalificacion(calificacion: number): void {
    this.valoracionForm.get('calificacion')?.setValue(calificacion);
  }

  enviarOpinion(): void {
    if (this.valoracionForm.invalid) {
      Swal.fire('Atención', 'Por favor, selecciona una calificación y escribe un comentario.', 'warning');
      return;
    }
    
    this.valoracionesService.crear(this.valoracionForm.value).subscribe({
      next: (res: any) => {
        Swal.fire('¡Gracias!', res.message, 'success');
        this.verificarEstado(); // Actualizamos para mostrar el mensaje de "ya opinaste"
      },
      error: (err: any) => {
        Swal.fire('Error', err.error.message || 'No se pudo enviar tu opinión.', 'error');
      }
    });
  }
}