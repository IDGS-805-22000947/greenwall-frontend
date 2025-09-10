import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenidoService } from '../../services/contenido';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.css']
})
export class FaqComponent implements OnInit {
  faqs: any[] = [];
  cargando = true;

  constructor(private contenidoService: ContenidoService) { }

  ngOnInit(): void {
    this.contenidoService.getFaq().subscribe(data => {
      this.faqs = data;
      this.cargando = false;
    });
  }
}
