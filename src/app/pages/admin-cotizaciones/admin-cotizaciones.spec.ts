import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCotizacionesComponent } from './admin-cotizaciones';

describe('AdminCotizaciones', () => {
  let component: AdminCotizacionesComponent;
  let fixture: ComponentFixture<AdminCotizacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCotizacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCotizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
