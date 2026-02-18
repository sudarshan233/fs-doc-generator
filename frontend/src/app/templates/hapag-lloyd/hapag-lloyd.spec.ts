import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HapagLloyd } from './hapag-lloyd';

describe('HapagLloyd', () => {
  let component: HapagLloyd;
  let fixture: ComponentFixture<HapagLloyd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HapagLloyd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HapagLloyd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
