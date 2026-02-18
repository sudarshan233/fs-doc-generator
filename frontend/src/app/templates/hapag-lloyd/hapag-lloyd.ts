import { Component } from '@angular/core';
import { HlCargoTable } from './components/hl-cargo-table/hl-cargo-table';
import { HlContinuation } from './components/hl-continuation/hl-continuation';
import { HlFooter } from './components/hl-footer/hl-footer';
import { HlHeader } from './components/hl-header/hl-header';
import { HlPartyRouting } from './components/hl-party-routing/hl-party-routing';

@Component({
  selector: 'app-hapag-lloyd',
  imports: [HlHeader, HlPartyRouting, HlCargoTable, HlFooter, HlContinuation],
  templateUrl: './hapag-lloyd.html',
  styleUrl: './hapag-lloyd.css',
})
export class HapagLloyd {

}
