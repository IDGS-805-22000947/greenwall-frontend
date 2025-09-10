import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { NosotrosComponent } from './pages/nosotros/nosotros';
import { ContactoComponent } from './pages/contacto/contacto';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { CotizacionComponent } from './components/cotizacion/cotizacion.component';
import { AdminCotizacionesComponent } from './pages/admin-cotizaciones/admin-cotizaciones';
import { AdminInventarioComponent } from './pages/admin-inventario/admin-inventario';
import { authGuard } from './auth/auth-guard';
import { adminGuard } from './auth/admin-guard';
import { AdminRecetaComponent } from './pages/admin-receta/admin-receta';
import { MisCotizacionesComponent } from './pages/mis-cotizaciones/mis-cotizaciones';
import { FaqComponent } from './pages/faq/faq';
import { AdminValoracionesComponent } from './pages/admin-valoraciones/admin-valoraciones';
import { AdminSolicitudesComponent } from './pages/admin-solicitudes/admin-solicitudes';
import { AdminComprasComponent } from './pages/admin-compras/admin-compras';
import { AdminDocumentosComponent } from './pages/admin-documentos/admin-documentos';
import { PerfilComponent } from './pages/perfil/perfil';
import { AdminGestionProveedoresComponent } from './pages/admin-gestion-proveedores/admin-gestion-proveedores';
import { MisComprasComponent } from './pages/mis-compras/mis-compras';
import { AdminVentasComponent } from './pages/admin-ventas/admin-ventas';
import {AdminProductosComponent} from './pages/admin-productos/admin-productos'

// AÑADIDO: Imports para los nuevos módulos
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { AdminUsuariosComponent } from './pages/admin-usuarios/admin-usuarios';

export const routes: Routes = [
  // Rutas Públicas
  { path: '', component: InicioComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'faq', component: FaqComponent },

  // Rutas de Cliente (protegidas por login)
  { path: 'cotizacion', component: CotizacionComponent, canActivate: [authGuard] },
  { path: 'mis-cotizaciones', component: MisCotizacionesComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'mis-compras', component: MisComprasComponent, canActivate: [authGuard] }, 


  // Rutas de Administrador (protegidas por login y rol de admin)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      // CORREGIDO: El dashboard es ahora la página principal
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // AÑADIDO: Ruta para el dashboard
      { path: 'dashboard', component: AdminDashboardComponent },
      // AÑADIDO: Ruta para la gestión de usuarios
      { path: 'usuarios', component: AdminUsuariosComponent },
      { path: 'ventas', component: AdminVentasComponent },
      { path: 'productos', component: AdminProductosComponent },
      { path: 'solicitudes', component: AdminSolicitudesComponent },
      { path: 'cotizaciones', component: AdminCotizacionesComponent },
      { path: 'valoraciones', component: AdminValoracionesComponent },
      { path: 'inventario', component: AdminInventarioComponent },
      { path: 'compras', component: AdminComprasComponent },
      { path: 'documentos', component: AdminDocumentosComponent },
      { path: 'receta', component: AdminRecetaComponent },
      { path: 'proveedores', component: AdminGestionProveedoresComponent },
    ]
  },

  // Ruta para cualquier otra URL, redirige al inicio
  { path: '**', redirectTo: '', pathMatch: 'full' }
];