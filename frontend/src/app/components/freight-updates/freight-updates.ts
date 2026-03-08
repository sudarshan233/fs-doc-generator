import { Component, Input } from '@angular/core';
import { HblItem } from '../../models/generate-payload';

@Component({
  selector: 'app-freight-updates',
  templateUrl: './freight-updates.html',
  styleUrl: './freight-updates.css',
})
export class FreightUpdates {
  @Input() hbl: HblItem | null = null;
}

