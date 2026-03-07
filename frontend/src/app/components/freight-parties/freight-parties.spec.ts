import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightParties } from './freight-parties';

describe('FreightParties', () => {
  let component: FreightParties;
  let fixture: ComponentFixture<FreightParties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreightParties]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreightParties);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
