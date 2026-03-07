import { Component } from '@angular/core';
import { FreightDetail } from '../freight-detail/freight-detail';
import { FreightVerification } from '../freight-verification/freight-verification';

@Component({
  selector: 'app-freight-metadata',
  imports: [FreightDetail, FreightVerification],
  templateUrl: './freight-metadata.html',
  styleUrl: './freight-metadata.css',
})
export class FreightMetadata {}
