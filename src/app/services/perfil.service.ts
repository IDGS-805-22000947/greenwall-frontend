// src/app/services/perfil.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

export interface Perfil {
  nombreCompleto: string;
  nombreEmpresa: string | null;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = `${environment.apiUrl}/Perfil`;

  constructor(private http: HttpClient) { }

  getPerfil(): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}/mis-datos`);
  }

  updatePerfil(perfil: Perfil): Observable<any> {
    return this.http.put(`${this.apiUrl}/mis-datos`, perfil);
  }

  cambiarPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cambiar-password`, data);
  }
}