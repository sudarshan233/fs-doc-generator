import { Injectable, signal } from '@angular/core';
import { GeneratePayload } from '../models/generate-payload';

@Injectable({ providedIn: 'root' })
export class GeneratePayloadService {
  /** Current payload to be rendered by the template. */
  readonly payload = signal<GeneratePayload | null>(null);

  setPayload(data: GeneratePayload | null): void {
    this.payload.set(data);
  }
}
