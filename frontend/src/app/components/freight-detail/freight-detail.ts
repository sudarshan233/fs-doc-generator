import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-freight-detail',
  imports: [],
  templateUrl: './freight-detail.html',
  styleUrl: './freight-detail.css',
})
export class FreightDetail {
  @Input() label = '';
  @Input() value = '';
}
