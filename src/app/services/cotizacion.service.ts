import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private apiUrl = `${environment.apiUrl}/Cotizacion`;

  constructor(private http: HttpClient) { }

  // --- MÉTODOS PARA EL CLIENTE ---
  previsualizarCotizacion(peticion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/previsualizar`, peticion);
  }

  confirmarCotizacion(peticion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmar`, peticion);
  }

  getMisCotizaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-cotizaciones`);
  }
  
  // --- MÉTODOS PARA EL ADMINISTRADOR ---
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