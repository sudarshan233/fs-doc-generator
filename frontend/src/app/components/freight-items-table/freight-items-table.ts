import { Component, Input } from '@angular/core';
import { HblItem } from '../../models/generate-payload';

@Component({
  selector: 'app-freight-items-table',
  imports: [],
  templateUrl: './freight-items-table.html',
  styleUrl: './freight-items-table.css',
})
export class FreightItemsTable {
  @Input() hbl: HblItem | null = null;
}
