// src/app/pages/perfil.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PerfilService, Perfil } from '../../services/perfil.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  passwordForm: FormGroup;
  emailUsuario: string | null = null; // Para mostrarlo (no editable)

  constructor(private fb: FormBuilder, private perfilService: PerfilService) {
    this.perfilForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      nombreEmpresa: [''],
      telefono: ['', Validators.required]
    });
    this.passwordForm = this.fb.group({
      passwordActual: ['', Validators.required],
      nuevoPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.perfilService.getPerfil().subscribe(data => {
      this.perfilForm.patchValue(data);
      // Asumimos que el email está en el token o en el authService
      // Aquí lo simulamos. Debes obtenerlo de tu servicio de autenticación.
      // this.emailUsuario = this.authService.getEmail(); 
    });
  }

  guardarPerfil(): void {
    if (this.perfilForm.invalid) return;
    this.perfilService.updatePerfil(this.perfilForm.value).subscribe({
      next: res => Swal.fire('¡Éxito!', res.message, 'success'),
      error: err => Swal.fire('Error', 'No se pudo actualizar el perfil.', 'error')
    });
  }

  cambiarPassword(): void {
    if (this.passwordForm.invalid) return;
    this.perfilService.cambiarPassword(this.passwordForm.value).subscribe({
      next: res => {
        Swal.fire('¡Éxito!', res.message, 'success');
        this.passwordForm.reset();
      },
      error: err => Swal.fire('Error', 'La contraseña actual es incorrecta o el nuevo password no es válido.', 'error')
    });
  }
}