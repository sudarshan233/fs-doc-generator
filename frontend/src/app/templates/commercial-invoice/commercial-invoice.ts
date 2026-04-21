import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-commercial-invoice',
  standalone: true,
  templateUrl: './commercial-invoice.html',
  styleUrl: './commercial-invoice.css',
})
export class CommercialInvoiceComponent {
  @Input() data: Record<string, any> = {};
}
