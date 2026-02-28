import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HapagLloyd } from './hapag-lloyd';
import { HlLabelCell } from './components/hl-label-cell/hl-label-cell';

describe('HapagLloyd', () => {
  let component: HapagLloyd;
  let fixture: ComponentFixture<HapagLloyd>;

  const normalizedText = (): string =>
    fixture.nativeElement.textContent.replace(/\s+/g, ' ').trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HapagLloyd],
    }).compileComponents();

    fixture = TestBed.createComponent(HapagLloyd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render key static document labels', () => {
    fixture.detectChanges();
    const text = normalizedText();

    expect(text).toContain('Sea Waybill');
    expect(text).toContain('Sea Waybill - Not Negotiable');
    expect(text).toContain('Container Nos., Seal Nos.; Marks and Nos.');
  });

  it('should bind core data values from mock data', () => {
    fixture.detectChanges();
    const text = normalizedText();

    expect(text).toContain(component.data.carrier);
    expect(text).toContain(component.data.documentType);
    expect(text).toContain(component.data.swbNo);
    expect(text).toContain(component.data.vessels[0]);
  });

  it('should render repeating rows and lines from arrays', () => {
    fixture.detectChanges();
    const text = normalizedText();
    const cargoRows = fixture.nativeElement.querySelectorAll('.hl-cargo-row');

    expect(cargoRows.length).toBe(component.data.containers.length);
    expect(text).toContain(component.data.shipper.address[0]);
    expect(text).toContain(component.data.containers[0].packages[0]);
  });

  it('should render reusable label-cell components with projected content', () => {
    fixture.detectChanges();
    const labelCells = fixture.debugElement.queryAll(By.directive(HlLabelCell));

    expect(labelCells.length).toBeGreaterThan(0);
    expect(labelCells[0].nativeElement.textContent).toContain('Shipper:');
    expect(labelCells[0].nativeElement.textContent).toContain(component.data.shipper.name);
  });
});
