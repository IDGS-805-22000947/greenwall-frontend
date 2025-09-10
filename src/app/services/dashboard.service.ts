import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

// Define la estructura de los datos que recibirá el dashboard
export interface DashboardData {
  comprasUltimos6Meses: { mes: string; total: number }[];
  proveedoresActivos: number;
  materialesEnBajoStock: number;
  solicitudesPendientes: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/Dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.apiUrl);
  }
}