import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confetti } from './confetti';

describe('Confetti', () => {
  let component: Confetti;
  let fixture: ComponentFixture<Confetti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confetti],
    }).compileComponents();

    fixture = TestBed.createComponent(Confetti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
