import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hl-label-cell',
  imports: [],
  templateUrl: './hl-label-cell.html',
  styleUrl: './hl-label-cell.css',
})
export class HlLabelCell {
  @Input({ required: true }) label!: string;
}
