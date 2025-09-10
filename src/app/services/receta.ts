
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Receta, RecetaDetalle } from '../models/receta.model';

@Injectable({ providedIn: 'root' })
export class RecetaService {
  // La URL base ahora apunta al nuevo RecetasController
  private apiUrl = `${environment.apiUrl}/Recetas`;

  constructor(private http: HttpClient) { }

  // Obtiene todas las recetas para un producto específico
  getRecetasPorProducto(productoId: number): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.apiUrl}/producto/${productoId}`);
  }

  // Obtiene el detalle completo de UNA receta (incluyendo sus materiales)
  getRecetaDetalle(recetaId: number): Observable<Receta> {
    return this.http.get<Receta>(`${this.apiUrl}/${recetaId}`);
  }

  // Crea una nueva receta (solo la información principal)
  crearReceta(receta: Omit<Receta, 'id' | 'isActiva'>): Observable<Receta> {
    return this.http.post<Receta>(this.apiUrl, receta);
  }

  // Actualiza la lista de materiales de una receta existente
  actualizarDetallesReceta(recetaId: number, detalles: Omit<RecetaDetalle, 'nombreMaterial' | 'unidad'>[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${recetaId}/detalles`, detalles);
  }

  // Activa una receta (y desactiva las otras del mismo producto)
  activarReceta(recetaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${recetaId}/activar`, {});
  }

  desactivarReceta(recetaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${recetaId}/desactivar`, {});
  }

  updateReceta(id: number, recetaData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, recetaData);
  }
}