import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-quotation',
  standalone: true,
  templateUrl: './quotation.html',
  styleUrl: './quotation.css',
})
export class QuotationComponent {
  @Input() data: Record<string, any> = {};
}
