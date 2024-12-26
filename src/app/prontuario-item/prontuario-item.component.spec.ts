import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProntuarioItemComponent } from './prontuario-item.component';

describe('ProntuarioItemComponent', () => {
  let component: ProntuarioItemComponent;
  let fixture: ComponentFixture<ProntuarioItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProntuarioItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProntuarioItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
