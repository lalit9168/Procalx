import { Component } from '@angular/core';
import { CalculatorComponent } from './calculator/calculator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalculatorComponent],
  template: `<app-calculator></app-calculator>`
})
export class App {}