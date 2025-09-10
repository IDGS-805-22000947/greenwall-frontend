import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisValoracionesComponent } from './mis-valoraciones';

describe('MisValoraciones', () => {
  let component: MisValoracionesComponent;
  let fixture: ComponentFixture<MisValoracionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisValoracionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisValoracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
