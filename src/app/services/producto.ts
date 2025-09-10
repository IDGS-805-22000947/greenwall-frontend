import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Producto } from '../models/producto.model'; 


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/Productos`;


   // La URL para el endpoint de admin podría ser diferente
  private adminApiUrl = `${environment.apiUrl}`; 

  constructor(private http: HttpClient) { }

  // Método para obtener todos los productos (para el select)
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}`);
  }

  // Actualizar los documentos
  updateDocumentos(id: number, documentos: { manualUrl: string | null, documentacionUrl: string | null }): Observable<any> {
    return this.http.put(`${this.adminApiUrl}/Productos/${id}/documentos`, documentos);
  }


  getProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }


  createProducto(producto: any): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  updateProducto(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}