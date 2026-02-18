import { Component } from '@angular/core';

@Component({
  selector: 'app-hl-header',
  imports: [],
  templateUrl: './hl-header.html',
  styleUrl: './hl-header.css',
})
export class HlHeader {
  getCarrierIcon(carrier: string): string {
    switch (carrier.toLowerCase()) {
      case 'hapag-lloyd':
        return '/assets/hapag-lloyd.png';
      // Add more carriers and their corresponding icons as needed
      default:
        return '/assets/default-carrier-icon.png'; // Fallback icon
    }
  }
}
