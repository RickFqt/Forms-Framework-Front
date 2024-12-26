import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesitoComponent } from './quesito.component';

describe('QuesitoComponent', () => {
  let component: QuesitoComponent;
  let fixture: ComponentFixture<QuesitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuesitoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuesitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
