import { Component, signal } from '@angular/core';
import { FreightParties } from './components/freight-parties/freight-parties';
import { FreightHeader } from './components/freight-header/freight-header';
import { FreightItemsTable } from './components/freight-items-table/freight-items-table';
import { FreightMetadata } from './components/freight-metadata/freight-metadata';
import { FreightChargesTable } from './components/freight-charges-table/freight-charges-table';
import { FreightUpdates } from './components/freight-updates/freight-updates';

@Component({
  selector: 'app-root',
  imports: [FreightParties, FreightHeader, FreightItemsTable, FreightMetadata, FreightChargesTable, FreightUpdates],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
