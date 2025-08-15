import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecetaComponent } from './admin-receta';

describe('AdminReceta', () => {
  let component: AdminRecetaComponent;
  let fixture: ComponentFixture<AdminRecetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRecetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
