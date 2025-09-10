// src/app/pages/registro/registro.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  registroForm: FormGroup;
  enviado = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombreEmpresa: [''],
      telefono: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      return;
    }

    // Esta línea ahora funciona
    this.authService.solicitarRegistro(this.registroForm.value).subscribe({
      // CORREGIDO: Se añaden los tipos 'any' para evitar errores
      next: (res: any) => {
        this.enviado = true;
      },
      // CORREGIDO: Se añaden los tipos 'any' para evitar errores
      error: (err: any) => {
        Swal.fire('Error en el registro', err.error, 'error');
      }
    });
  }
}