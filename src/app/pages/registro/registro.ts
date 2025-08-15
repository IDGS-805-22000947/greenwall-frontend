import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  userInfo = {
    nombreCompleto: '',
    email: '',
    password: ''
  };
  serverErrors: string[] = [];
  success: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.serverErrors = [];
    this.success = null;
    this.authService.registro(this.userInfo).subscribe({
      next: (response) => {
        this.success = "¡Registro exitoso! Serás redirigido para iniciar sesión.";
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: (err) => {
        if (err.error.errors) {
          this.serverErrors = Object.values(err.error.errors).flat() as string[];
        } else if (err.error?.message) {
          this.serverErrors.push(err.error.message);
        } else {
          this.serverErrors.push('Ocurrió un error inesperado durante el registro.');
        }
      }
    });
  }
}