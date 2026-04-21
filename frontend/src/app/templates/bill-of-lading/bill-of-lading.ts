import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bill-of-lading',
  standalone: true,
  templateUrl: './bill-of-lading.html',
  styleUrl: './bill-of-lading.css',
})
export class BillOfLadingComponent {
  @Input() data: Record<string, any> = {};
}
