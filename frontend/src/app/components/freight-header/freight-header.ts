import { Component, Input } from '@angular/core';
import { HblItem } from '../../models/generate-payload';

@Component({
  selector: 'app-freight-header',
  imports: [],
  templateUrl: './freight-header.html',
  styleUrl: './freight-header.css',
})
export class FreightHeader {
  @Input() hbl: HblItem | null = null;
}
