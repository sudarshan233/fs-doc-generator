import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneratePayload } from '../models/generate-payload';

@Injectable({ providedIn: 'root' })
export class GeneratePayloadService {
  private http = inject(HttpClient);

  /** Current payload (from last GET or setPayload). */
  readonly payload = signal<GeneratePayload | null>(null);

  /** Fetch last payload from backend (after POST /generate has been called). */
  loadLastPayload(): void {
    const url = '/api/v1/last-payload';
    this.http.get<GeneratePayload>(url).subscribe({
      next: (data) => this.payload.set(data),
      error: () => this.payload.set(null),
    });
  }

  /** Set payload directly (e.g. from route state or postMessage). */
  setPayload(data: GeneratePayload | null): void {
    this.payload.set(data);
  }
}
