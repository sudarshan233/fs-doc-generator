import { Component, signal } from '@angular/core';
import { HapagLloyd } from './templates/hapag-lloyd/hapag-lloyd';

@Component({
  selector: 'app-root',
  imports: [HapagLloyd],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
