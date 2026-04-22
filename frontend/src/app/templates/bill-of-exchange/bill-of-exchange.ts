import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bill-of-exchange',
  standalone: true,
  templateUrl: './bill-of-exchange.html',
  styleUrl: './bill-of-exchange.css',
})
export class BillOfExchangeComponent {
  @Input() data: Record<string, any> = {};
}
