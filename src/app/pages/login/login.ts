import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // ESTE OBJETO FALTABA: Conecta el HTML con el TypeScript
  credentials = {
    email: '',
    password: ''
  };
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.error = "Por favor, completa todos los campos.";
      return;
    }
    this.error = null;

    this.authService.login(this.credentials).subscribe({
      // El rol ahora llega directamente como un parámetro en 'next'
      next: (role: string | null) => { 
        if (role === 'Administrador') {
          // Si es Admin, va al panel de administración
          this.router.navigate(['/admin']);
        } else {
          // Si es Cliente, va a su perfil
          this.router.navigate(['/perfil']);
        }
      },
      error: (err) => {
        this.error = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
        console.error(err);
      }
    });
  }
}