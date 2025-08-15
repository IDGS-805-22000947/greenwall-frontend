import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private apiUrl = `${environment.apiUrl}/Receta`;
  constructor(private http: HttpClient) { }

  getReceta(productoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${productoId}`);
  }
  addIngrediente(productoId: number, ingrediente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productoId}`, ingrediente);
  }
  deleteIngrediente(productoId: number, materialId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productoId}/material/${materialId}`);
  }
}