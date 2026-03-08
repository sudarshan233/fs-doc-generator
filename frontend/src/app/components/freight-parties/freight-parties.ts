import { Component, Input } from '@angular/core';
import { Party } from '../../models/generate-payload';

@Component({
  selector: 'app-freight-parties',
  imports: [],
  templateUrl: './freight-parties.html',
  styleUrl: './freight-parties.css',
})
export class FreightParties {
  /** Label, e.g. "Shipper:", "Consignee:", "Notify party:" */
  @Input() label = '';
  @Input() party: Party | null = null;

  get partyText(): string {
    const p = this.party;
    if (!p) return '';
    return [p.name, p.address].filter(Boolean).join('\n');
  }
}
