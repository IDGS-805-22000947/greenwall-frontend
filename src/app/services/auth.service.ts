// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs'; 
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;

  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  private _userRole = new BehaviorSubject<string | null>(this.getRoleFromToken());
  public userRole$ = this._userRole.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<string | null> { //El método ahora devuelve el rol
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Esto se ejecuta primero: guarda el token y actualiza el estado
        localStorage.setItem('token', response.token);
        this._isLoggedIn.next(true);
        this._userRole.next(this.getRoleFromToken());
      }),
      map(() => this.getUserRole()) //Devuelve el rol actualizado al componente que llamó
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this._isLoggedIn.next(false);
    this._userRole.next(null);
  }

  // --- MÉTODO AÑADIDO (Corrige el error en registro.ts) ---
  solicitarRegistro(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/solicitud-registro`, datos);
  }

  // --- MÉTODO AÑADIDO (Corrige el error en token.interceptor.ts) ---
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn.getValue();
  }

  public getUserRole(): string | null {
    return this._userRole.getValue();
  }
  
  public getEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    return decodedToken.email || decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null;
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role || null;
  }
}