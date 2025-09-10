import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGestionProveedoresComponent } from './admin-gestion-proveedores';

describe('AdminMaterials', () => {
  let component: AdminGestionProveedoresComponent;
  let fixture: ComponentFixture<AdminGestionProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGestionProveedoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGestionProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
