import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; 
import { CotizacionService } from '../../services/cotizacion.service';

@Component({
  selector: 'app-mis-cotizaciones',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink    
  ],
  templateUrl: './mis-cotizaciones.html', 
})
export class MisCotizacionesComponent implements OnInit {
  cotizaciones: any[] = [];
  cargando = true;

  constructor(private cotizacionService: CotizacionService) { }

  ngOnInit(): void {
    this.cotizacionService.getMisCotizaciones().subscribe(data => {
      this.cotizaciones = data;
      this.cargando = false;
    });
  }
}