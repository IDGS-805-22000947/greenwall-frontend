// src/app/services/proveedor.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment'; // Corregí la ruta a 'environments'
import { Proveedor } from '../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = `${environment.apiUrl}/Proveedores`;

  constructor(private http: HttpClient) { }

  getActivos(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/activos`);
  }

  getInactivos(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/inactivos`);
  }

  create(proveedor: Omit<Proveedor, 'id' | 'isActivo'>): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  update(id: number, proveedor: Omit<Proveedor, 'isActivo'>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, proveedor);
  }

  desactivar(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/desactivar`, {});
  }

  reactivar(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/reactivar`, {});
  }

  // --- BLOQUE DE CÓDIGO AÑADIDO ---
  // Estos son los métodos que tu nuevo componente necesita.

  /**
   * Obtiene un array con los IDs de los materiales asociados a un proveedor específico.
   * @param proveedorId El ID del proveedor.
   */
  getMaterialesIdsPorProveedor(proveedorId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${proveedorId}/materiales-ids`);
  }

  /**
   * Reemplaza la lista de materiales asociados a un proveedor con una nueva lista.
   * @param proveedorId El ID del proveedor a actualizar.
   * @param materialIds Un array con los nuevos IDs de materiales a asociar.
   */
  actualizarMaterialesProveedor(proveedorId: number, materialIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${proveedorId}/materiales`, materialIds);
  }
}