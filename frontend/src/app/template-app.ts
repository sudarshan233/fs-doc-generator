import { Component, inject } from '@angular/core';
import { BillOfLadingComponent } from './templates/bill-of-lading/bill-of-lading';
import { TemplatePayloadService } from './services/template-payload.service';

@Component({
  selector: 'app-template-root',
  standalone: true,
  imports: [BillOfLadingComponent],
  template: `
    <div class="flex flex-col p-4 w-[210mm] min-h-[297mm] mx-auto bg-white">
      @if (payloadService.payload(); as payload) {
        @if (payload.template_type === 'BillOfLading') {
          <app-bill-of-lading [data]="payload.data"></app-bill-of-lading>
        } @else {
          <p class="text-red-500 font-bold p-8">Unknown template type: {{ payload.template_type }}</p>
        }
      } @else {
        <p class="text-gray-500">No template payload found.</p>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: white;
    }
  `],
})
export class TemplateApp {
  protected readonly payloadService = inject(TemplatePayloadService);
}
