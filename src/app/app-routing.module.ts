import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { NosotrosComponent } from './pages/nosotros/nosotros';
import { ContactoComponent } from './pages/contacto/contacto';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { CotizacionComponent } from './components/cotizacion/cotizacion.component'; // <-- Componente del CLIENTE
import { AdminCotizacionesComponent } from './pages/admin-cotizaciones/admin-cotizaciones'; // <-- Componente del ADMIN
import { AdminInventarioComponent } from './pages/admin-inventario/admin-inventario';
import { AdminMaterialsComponent } from './pages/admin-materials/admin-materials';
import { authGuard } from './auth/auth-guard';
import { adminGuard } from './auth/admin-guard';
import { AdminRecetaComponent } from './pages/admin-receta/admin-receta'; 
import { MisCotizacionesComponent } from './pages/mis-cotizaciones/mis-cotizaciones';



export const routes: Routes = [
  // Rutas Públicas
  { path: '', component: InicioComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  

  // Ruta de Cliente (protegida por login)
  { 
    path: 'cotizacion', 
    // Debe usar el componente del cliente, no el del admin.
    component: CotizacionComponent, 
    canActivate: [authGuard]
  },
  
  // Rutas de Administrador (protegidas por login y rol de admin)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'cotizaciones', pathMatch: 'full' },
      { path: 'cotizaciones', component: AdminCotizacionesComponent }, 
      { path: 'inventario', component: AdminInventarioComponent },
      { path: 'materiales', component: AdminMaterialsComponent },
      { path: 'receta', component: AdminRecetaComponent }
    ]
  },
  { path: 'mis-cotizaciones', 
    component: MisCotizacionesComponent, 
    canActivate: [authGuard] },
  
  // Ruta para cualquier otra URL, redirige al inicio
  { path: '**', redirectTo: '', pathMatch: 'full' }
];