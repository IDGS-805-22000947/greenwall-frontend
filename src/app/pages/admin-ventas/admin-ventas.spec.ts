import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVentasComponent } from './admin-ventas';

describe('AdminVentas', () => {
  let component: AdminVentasComponent;
  let fixture: ComponentFixture<AdminVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
