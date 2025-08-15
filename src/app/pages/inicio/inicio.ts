import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; // <-- Importa esto
import { CommonModule } from '@angular/common'; // <-- Importa CommonModule
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  standalone: true, 
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class InicioComponent {

}
