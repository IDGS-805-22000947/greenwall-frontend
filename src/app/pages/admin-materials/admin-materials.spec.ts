import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMaterialsComponent } from './admin-materials';

describe('AdminMaterials', () => {
  let component: AdminMaterialsComponent;
  let fixture: ComponentFixture<AdminMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMaterialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
