// src/app/services/cotizacion.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { PeticionCotizacion, ResultadoCotizacion } from '../models/cotizacion.model';
import { MisCotizaciones } from '../models/mis-cotizaciones.model';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private apiUrl = `${environment.apiUrl}/Cotizacion`;

  constructor(private http: HttpClient) { }

  // --- MÉTODOS PARA EL CLIENTE (Ahora con tipos de datos correctos) ---
  previsualizarCotizacion(peticion: PeticionCotizacion): Observable<ResultadoCotizacion> {
    return this.http.post<ResultadoCotizacion>(`${this.apiUrl}/previsualizar`, peticion);
  }

  confirmarCotizacion(peticion: PeticionCotizacion): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmar`, peticion);
  }

  getMisCotizaciones(): Observable<MisCotizaciones[]> { // <-- Usa el nuevo modelo
    return this.http.get<MisCotizaciones[]>(`${this.apiUrl}/mis-cotizaciones`);
  }
  
  // --- MÉTODOS PARA EL ADMINISTRADOR (se mantienen igual) ---
  obtenerTodasLasCotizaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todas`);
  }
  
  aprobarCotizacion(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/aprobar`, {});
  }

  rechazarCotizacion(id: number, motivo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/rechazar`, { motivo });
  }
}