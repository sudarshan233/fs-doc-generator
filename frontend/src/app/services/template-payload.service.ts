import { Injectable, signal } from '@angular/core';
import { TemplatePayload } from '../models/template-payload';

@Injectable({
  providedIn: 'root',
})
export class TemplatePayloadService {
  private readonly _payload = signal<TemplatePayload | null>(null);
  public readonly payload = this._payload.asReadonly();

  public setPayload(payload: TemplatePayload | null): void {
    this._payload.set(payload);
  }
}
