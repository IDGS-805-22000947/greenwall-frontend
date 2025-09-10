import { Component, OnInit, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-detalle.html',
})
export class ProductoDetalleComponent implements OnInit {
  producto: any = null;
  videoUrlSeguro: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productoService.getProducto(parseInt(id, 10)).subscribe(data => {
        this.producto = data;
        // Sanitizamos la URL del video para evitar errores de seguridad de Angular
        if (this.producto.videoUrl) {
          this.videoUrlSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(this.producto.videoUrl);
        }
      });
    }
  }
}