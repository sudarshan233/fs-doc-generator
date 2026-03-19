import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { GeneratePayloadService } from './services/generate-payload.service';
import { GeneratePayload } from './models/generate-payload';

describe('App', () => {
  const samplePayload: GeneratePayload = {
    mbl_number: 'MBL-001',
    total_count: 1,
    hbl_list: [
      {
        sea_waybill_no: 'HBL-001',
        carrier_reference: 'CR-001',
        export_reference: 'ER-001',
        bill_type: 'Sea Waybill',
        shipper: {
          name: 'Shipper Ltd',
          address: '123 Export Street',
        },
        consignee: {
          name: 'Consignee Ltd',
          address: '456 Import Avenue',
        },
        notify_party: {
          name: 'Notify Party',
          address: '789 Dock Road',
        },
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [GeneratePayloadService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render payload data into the template', async () => {
    TestBed.inject(GeneratePayloadService).setPayload(samplePayload);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('MBL: MBL-001');
    expect(compiled.textContent).toContain('HBL-001');
  });
});
