import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { jwtDecode } from 'jwt-decode';
import { CotizacionPeticion } from '../models/cotizacion.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  calcular(peticion: CotizacionPeticion) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.apiUrl}/Auth`;
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient) {
    // Al iniciar, comprueba si hay un token válido
    const token = localStorage.getItem('authToken');
    this._isLoggedIn$.next(!!token && !this.isTokenExpired(token));
  }


  public isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        this._isLoggedIn$.next(true);
      })
    );
  }

  registro(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, userInfo);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this._isLoggedIn$.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const decodedToken: any = jwtDecode(token);
      // El nombre del claim de rol puede variar. Comúnmente es 'role' o una URL.
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }
    return null;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp === undefined) return false;
      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date.valueOf() <= new Date().valueOf();
    } catch (err) {
      return false;
    }
  }
}