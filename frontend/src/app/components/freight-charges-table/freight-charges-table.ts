import { Component, Input } from '@angular/core';
import { HblItem } from '../../models/generate-payload';

@Component({
  selector: 'app-freight-charges-table',
  templateUrl: './freight-charges-table.html',
  styleUrl: './freight-charges-table.css',
})
export class FreightChargesTable {
  @Input() hbl: HblItem | null = null;
}

