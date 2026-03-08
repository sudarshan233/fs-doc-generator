import { Component, Input } from '@angular/core';
import { FreightDetail } from '../freight-detail/freight-detail';
import { FreightVerification } from '../freight-verification/freight-verification';
import { HblItem, ContainerDetail } from '../../models/generate-payload';

@Component({
  selector: 'app-freight-metadata',
  imports: [FreightDetail, FreightVerification],
  templateUrl: './freight-metadata.html',
  styleUrl: './freight-metadata.css',
})
export class FreightMetadata {
  @Input() hbl: HblItem | null = null;

  get containerNos(): string {
    const list = this.hbl?.container_details?.map((c: ContainerDetail) => c.container_no).filter(Boolean) ?? [];
    return list.length ? list.join(', ') : '—';
  }

  get forwardingAgentText(): string {
    const a = this.hbl?.forwarding_agent;
    if (!a?.name && !a?.address) return '—';
    return [a.name, a.address].filter(Boolean).join('\n');
  }
}
