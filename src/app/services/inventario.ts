import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = `${environment.apiUrl}/Inventario`;

  constructor(private http: HttpClient) { }

  getHistorialMaterial(materialId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${materialId}`);
  }

  registrarEntrada(entrada: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/entrada`, entrada);
  }
}