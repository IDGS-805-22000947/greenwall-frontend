// src/app/layout/header/header.ts

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  isAdmin$!: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Controla si se muestra "Login" o "Logout"
    this.isLoggedIn$ = this.authService.isLoggedIn$;

    
    this.isAdmin$ = this.authService.userRole$.pipe(
      map(role => role === 'Administrador')
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}