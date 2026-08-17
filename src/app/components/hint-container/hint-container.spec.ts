import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HintContainer } from './hint-container';

describe('HintContainer', () => {
  let component: HintContainer;
  let fixture: ComponentFixture<HintContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HintContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(HintContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
