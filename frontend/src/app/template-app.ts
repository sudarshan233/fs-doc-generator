import { Component, inject } from '@angular/core';
import { BillOfLadingComponent } from './templates/bill-of-lading/bill-of-lading';
import { CommercialInvoiceComponent } from './templates/commercial-invoice/commercial-invoice';
import { QuotationComponent } from './templates/quotation/quotation';
import { BillOfExchangeComponent } from './templates/bill-of-exchange/bill-of-exchange';
import { TemplatePayloadService } from './services/template-payload.service';

@Component({
  selector: 'app-template-root',
  standalone: true,
  imports: [BillOfLadingComponent, CommercialInvoiceComponent, QuotationComponent, BillOfExchangeComponent],
  template: `
    <div class="flex flex-col p-4 w-[210mm] min-h-[297mm] mx-auto bg-white">
      @if (payloadService.payload(); as payload) {
        @if (payload.template_type === 'BillOfLading') {
          <app-bill-of-lading [data]="payload.data"></app-bill-of-lading>
        } @else if (payload.template_type === 'CommercialInvoice') {
          <app-commercial-invoice [data]="payload.data"></app-commercial-invoice>
        } @else if (payload.template_type === 'Quotation') {
          <app-quotation [data]="payload.data"></app-quotation>
        } @else if (payload.template_type === 'BillOfExchange') {
          <app-bill-of-exchange [data]="payload.data"></app-bill-of-exchange>
        } @else {
          <p class="text-red-500 font-bold p-8">Unknown template type: {{ payload.template_type }}</p>
        }
      } @else {
        <p class="text-gray-500">No template payload found.</p>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: white;
    }
  `],
})
export class TemplateApp {
  protected readonly payloadService = inject(TemplatePayloadService);
}
