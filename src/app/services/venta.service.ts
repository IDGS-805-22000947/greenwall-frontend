import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private apiUrl = `${environment.apiUrl}/Ventas`;

  constructor(private http: HttpClient) { }

  crearVenta(cotizacionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/desde-cotizacion/${cotizacionId}`, {});
  }

  getMisCompras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-compras`);
  }

  getTodasLasVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}