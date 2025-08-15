import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();
  if (authService.isLoggedIn$ && userRole === 'Administrador') {
    return true;
  } else {
    router.navigate(['/']); // O a una página de "acceso denegado"
    return false;
  }
};