import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioViewComponent } from './formulario-view.component';

describe('FormularioViewComponent', () => {
  let component: FormularioViewComponent;
  let fixture: ComponentFixture<FormularioViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
