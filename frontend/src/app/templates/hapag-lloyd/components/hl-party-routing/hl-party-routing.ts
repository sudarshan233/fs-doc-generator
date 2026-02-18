import { Component } from '@angular/core';
import { HlHeader } from '../hl-header/hl-header';

@Component({
  selector: 'app-hl-party-routing',
  imports: [],
  templateUrl: './hl-party-routing.html',
  styleUrl: './hl-party-routing.css',
})
export class HlPartyRouting {
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
