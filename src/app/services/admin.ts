import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Usuario, UsuarioUpdate } from '../models/usuario.model'; // Importa los modelos

export interface SolicitudPendiente {
  id: string;
  nombreCompleto: string;
  email: string;
  nombreEmpresa: string | null;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // CORREGIDO: URLs base para cada controlador
  private solicitudesApiUrl = `${environment.apiUrl}/Solicitudes`;
  private adminApiUrl = `${environment.apiUrl}/Admin`; // URL para el AdminController

  constructor(private http: HttpClient) { }

  // --- MÉTODOS PARA SOLICITUDES ---
  getSolicitudesPendientes(): Observable<SolicitudPendiente[]> {
    return this.http.get<SolicitudPendiente[]>(`${this.solicitudesApiUrl}/pendientes`);
  }

  aprobarSolicitud(id: string): Observable<any> {
    return this.http.post(`${this.solicitudesApiUrl}/${id}/aprobar`, {});
  }

  rechazarSolicitud(id: string): Observable<any> {
    return this.http.post(`${this.solicitudesApiUrl}/${id}/rechazar`, {});
  }

  // --- MÉTODOS PARA GESTIÓN DE USUARIOS ---
  getUsuarios(): Observable<Usuario[]> {
    // CORREGIDO: Usa la URL correcta del AdminController
    return this.http.get<Usuario[]>(`${this.adminApiUrl}/usuarios`);
  }

  updateUsuario(id: string, data: UsuarioUpdate): Observable<void> {
    // CORREGIDO: Usa la URL correcta del AdminController
    return this.http.put<void>(`${this.adminApiUrl}/usuarios/${id}`, data);
  }
}