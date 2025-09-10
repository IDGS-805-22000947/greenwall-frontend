import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContenidoService {
  private apiUrl = `${environment.apiUrl}/Contenido`;

  constructor(private http: HttpClient) { }

  getFaq(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/faq`);
  }
}
