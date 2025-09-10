import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Valoracion, EstadoMiValoracion } from '../models/valoracion.model';

@Injectable({ providedIn: 'root' })
export class ValoracionesService {
  private apiUrl = `${environment.apiUrl}/Valoraciones`;
  private adminApiUrl = `${environment.apiUrl}/Admin/valoraciones`;

  constructor(private http: HttpClient) {}

  getAprobadas(): Observable<Valoracion[]> {
    return this.http.get<Valoracion[]>(`${this.apiUrl}/aprobadas`);
  }

  crear(data: { calificacion: number, comentario: string }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getMiEstado(): Observable<EstadoMiValoracion> {
    return this.http.get<EstadoMiValoracion>(`${this.apiUrl}/mi-estado`);
  }

  // Métodos para Admin
  getPendientes(): Observable<Valoracion[]> {
    return this.http.get<Valoracion[]>(`${this.adminApiUrl}/pendientes`);
  }
  aprobar(id: number): Observable<any> {
    return this.http.post(`${this.adminApiUrl}/${id}/aprobar`, {});
  }
  rechazar(id: number): Observable<any> {
    return this.http.post(`${this.adminApiUrl}/${id}/rechazar`, {});
  }
}