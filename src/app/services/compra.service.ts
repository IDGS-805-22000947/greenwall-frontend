// src/app/services/compra.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { CompraVista, CompraDetalleVista } from '../models/compra.model';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = `${environment.apiUrl}/Compras`;

  constructor(private http: HttpClient) { }

  getCompras(): Observable<CompraVista[]> {
    return this.http.get<CompraVista[]>(this.apiUrl);
  }

  getCompraDetalle(id: number): Observable<CompraDetalleVista> {
    return this.http.get<CompraDetalleVista>(`${this.apiUrl}/${id}`);
  }

  create(compra: any): Observable<any> {
    return this.http.post(this.apiUrl, compra);
  }
}