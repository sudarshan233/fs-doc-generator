import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  effect,
  inject,
  PLATFORM_ID,
  OnInit,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FreightParties } from './components/freight-parties/freight-parties';
import { FreightHeader } from './components/freight-header/freight-header';
import { FreightItemsTable } from './components/freight-items-table/freight-items-table';
import { FreightMetadata } from './components/freight-metadata/freight-metadata';
import { FreightChargesTable } from './components/freight-charges-table/freight-charges-table';
import { FreightUpdates } from './components/freight-updates/freight-updates';
import { GeneratePayload } from './models/generate-payload';
import { GeneratePayloadService } from './services/generate-payload.service';
import { PdfExportService } from './services/pdf-export.service';

@Component({
  selector: 'app-root',
  imports: [FreightParties, FreightHeader, FreightItemsTable, FreightMetadata, FreightChargesTable, FreightUpdates],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewInit {
  protected readonly payloadService = inject(GeneratePayloadService);
  private readonly pdfExportService = inject(PdfExportService);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChildren('documentCard', { read: ElementRef })
  private documentCards!: QueryList<ElementRef<HTMLElement>>;

  protected readonly exportState = signal<'idle' | 'exporting' | 'done' | 'error'>('idle');
  protected readonly exportedFiles = signal<string[]>([]);

  private readonly viewReady = signal(false);
  private readonly lastExportSignature = signal<string | null>(null);
  private readonly exportWatcher = effect(() => {
    const payload = this.payloadService.payload();

    if (!isPlatformBrowser(this.platformId) || !this.viewReady() || !payload?.hbl_list?.length) {
      return;
    }

    void this.exportDocuments(payload);
  });

  ngOnInit(): void {
    this.payloadService.loadLastPayload();
  }

  ngAfterViewInit(): void {
    this.viewReady.set(true);
  }

  protected async exportDocuments(payload: GeneratePayload | null = this.payloadService.payload()): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !payload?.hbl_list?.length) {
      return;
    }

    const payloadSignature = this.buildPayloadSignature(payload);
    if (this.lastExportSignature() === payloadSignature || this.exportState() === 'exporting') {
      return;
    }

    this.exportState.set('exporting');

    try {
      await this.waitForRenderedDocuments();

      const documentElements = this.documentCards?.toArray().map((card) => card.nativeElement) ?? [];
      const documents = payload.hbl_list;
      const savedFiles: string[] = [];

      for (let index = 0; index < documents.length; index += 1) {
        const element = documentElements[index];
        const hbl = documents[index];

        if (!element) {
          continue;
        }

        const fileName = this.buildFileName(payload, hbl, index);
        const result = await this.pdfExportService.renderAndStorePdf(element, fileName);
        savedFiles.push(result.fileName);
      }

      this.exportedFiles.set(savedFiles);
      this.lastExportSignature.set(payloadSignature);
      this.exportState.set('done');
    } catch (error) {
      console.error('Failed to export PDFs', error);
      this.exportState.set('error');
    }
  }

  protected get renderedDocumentCount(): number {
    return this.payloadService.payload()?.hbl_list?.length ?? 0;
  }

  private async waitForRenderedDocuments(): Promise<void> {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }

  private buildPayloadSignature(payload: GeneratePayload): string {
    return JSON.stringify({
      mbl: payload.mbl_number ?? '',
      total_count: payload.total_count ?? 0,
      documents:
        payload.hbl_list?.map((hbl, index) => ({
          index,
          sea_waybill_no: hbl.sea_waybill_no ?? '',
          carrier_reference: hbl.carrier_reference ?? '',
          export_reference: hbl.export_reference ?? '',
        })) ?? [],
    });
  }

  private buildFileName(payload: GeneratePayload, hbl: NonNullable<GeneratePayload['hbl_list']>[number], index: number): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const documentLabel = this.sanitizeForFileName(
      hbl.sea_waybill_no ?? hbl.carrier_reference ?? hbl.export_reference ?? `document-${index + 1}`,
    );
    const masterBill = this.sanitizeForFileName(payload.mbl_number ?? 'mbl');

    return `${masterBill}-${String(index + 1).padStart(2, '0')}-${documentLabel}-${timestamp}.pdf`;
  }

  private sanitizeForFileName(value: string): string {
    const cleaned = value
      .trim()
      .replace(/\.[^.]+$/u, '')
      .replace(/[^a-z0-9-_]+/gi, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');

    return cleaned || 'document';
  }
}
