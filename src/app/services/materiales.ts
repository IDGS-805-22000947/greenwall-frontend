import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  private apiUrl = `${environment.apiUrl}/Materiales`;

  constructor(private http: HttpClient) { }

  getMaterialesActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activos`);
  }
  
  getMaterialesInactivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inactivos`);
  }

  getMaterialesConStock(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/con-stock`);
  }

  addMaterial(material: any): Observable<any> {
    return this.http.post(this.apiUrl, material);
  }

  updateMaterial(id: number, material: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, material);
  }

  desactivarMaterial(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/desactivar`, {});
  }

  reactivarMaterial(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/reactivar`, {});
  }

  DeleteMaterialPermanentemente(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
}