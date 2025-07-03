// calculator.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface CalculationResponse {
  result: number | string;
}

interface CalculationError {
  error: {
    error: string;
  };
}

interface CalculationHistory {
  id: number;
  expression: string;
  result: number | string;
  timestamp: Date;
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  a: number = 0;
  b: number = 0;
  operation: string = 'add';
  result: number | string | null = null;
  error: string = '';
  isLoading: boolean = false;
  displayValue: string = '0';
  lastCalculation: string = '';
  isDarkMode: boolean = false;
  history: CalculationHistory[] = [];
  particles: Array<{x: number, y: number, delay: number}> = [];

  private readonly operationInfo = {
    add: { name: 'Addition', description: 'Adds two numbers together (A + B). The fundamental arithmetic operation for combining quantities.' },
    subtract: { name: 'Subtraction', description: 'Subtracts the second number from the first (A - B). Find the difference between two values.' },
    multiply: { name: 'Multiplication', description: 'Multiplies two numbers (A × B). Repeated addition or scaling of quantities.' },
    divide: { name: 'Division', description: 'Divides the first number by the second (A ÷ B). Split a quantity into equal parts.' },
    power: { name: 'Exponentiation', description: 'Raises the first number to the power of the second (A^B). Repeated multiplication.' },
    factorial: { name: 'Factorial', description: 'Calculates the factorial of the first number (A!). Product of all positive integers up to A.' },
    sqrt: { name: 'Square Root', description: 'Calculates the square root of the first number (√A). Find the number that when squared gives A.' },
    modulus: { name: 'Modulus', description: 'Returns the remainder when A is divided by B (A % B). Useful for cyclic calculations.' },
    sin: { name: 'Sine', description: 'Calculates the sine of the first number (sin A). Trigonometric function for angles in radians.' },
    cos: { name: 'Cosine', description: 'Calculates the cosine of the first number (cos A). Trigonometric function for angles in radians.' },
    tan: { name: 'Tangent', description: 'Calculates the tangent of the first number (tan A). Trigonometric function for angles in radians.' },
    log: { name: 'Natural Logarithm', description: 'Calculates the natural logarithm of the first number (ln A). Inverse of exponential function.' }
  };

  constructor(private http: HttpClient) {
    this.generateParticles();
    this.updateDisplay();
  }

  ngOnInit() {
    // Load theme preference
    const savedTheme = localStorage.getItem('calculator-theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }

    // Load history
    const savedHistory = localStorage.getItem('calculator-history');
    if (savedHistory) {
      this.history = JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    }
  }

  generateParticles() {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 8
      });
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('calculator-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('calculator-theme', 'light');
    }
  }

  updateDisplay() {
    if (this.result !== null) {
      this.displayValue = this.formatResult(this.result);
    } else if (this.a !== 0 || this.b !== 0) {
      if (this.isSingleArgOperation()) {
        this.displayValue = this.a.toString();
      } else {
        this.displayValue = `${this.a} ${this.getOperationSymbol()} ${this.b}`;
      }
    } else {
      this.displayValue = '0';
    }
  }

  getOperationSymbol(): string {
    const symbols = {
      add: '+', subtract: '−', multiply: '×', divide: '÷',
      power: '^', factorial: '!', sqrt: '√', modulus: '%',
      sin: 'sin', cos: 'cos', tan: 'tan', log: 'ln'
    };
    return symbols[this.operation as keyof typeof symbols] || '';
  }

  calculate(event: Event): void {
    event.preventDefault();
    this.isLoading = true;
    this.error = '';
    this.result = null;

    const payload: any = { a: this.a, operation: this.operation };
    if (!this.isSingleArgOperation()) {
      payload.b = this.b;
    }

    this.http.post<CalculationResponse>('http://localhost:3000/api/calculate', payload)
      .subscribe({
        next: (res) => {
          // Accept both number and string results
          if (
            (typeof res.result === 'number' && !isNaN(res.result)) ||
            (typeof res.result === 'string' && res.result.length > 0)
          ) {
            this.result = res.result;
            this.error = '';
            this.lastCalculation = this.getCalculationString();
            this.addToHistory();
          } else {
            this.result = null;
            this.error = 'No valid result returned from server.';
          }
          this.isLoading = false;
          this.updateDisplay();
        },
        error: (err) => {
          this.result = null;
          this.error = err.error?.error || err.error?.message || 'Server error occurred. Please try again.';
          this.isLoading = false;
          this.updateDisplay();
        }
      });
  }

  addToHistory() {
    if (this.result !== null) {
      const historyItem: CalculationHistory = {
        id: Date.now(),
        expression: this.getCalculationString(),
        result: this.result,
        timestamp: new Date()
      };
      this.history.unshift(historyItem);
      if (this.history.length > 10) {
        this.history = this.history.slice(0, 10);
      }
      localStorage.setItem('calculator-history', JSON.stringify(this.history));
    }
  }

  useHistoryItem(item: CalculationHistory) {
    // Extract values from history item (simplified approach)
    this.result = item.result;
    this.displayValue = this.formatResult(item.result);
    this.lastCalculation = item.expression;
  }

  clearHistory() {
    this.history = [];
    localStorage.removeItem('calculator-history');
  }

  clearAll() {
    this.a = 0;
    this.b = 0;
    this.result = null;
    this.error = '';
    this.lastCalculation = '';
    this.updateDisplay();
  }

  copyResult() {
    if (this.result !== null) {
      navigator.clipboard.writeText(this.result.toString()).then(() => {
        // Could add a toast notification here
      });
    }
  }

  onOperationChange(): void {
    this.result = null;
    this.error = '';
    this.lastCalculation = '';
    
    if (this.isSingleArgOperation()) {
      this.b = 0;
    }
    this.updateDisplay();
  }

  isSingleArgOperation(): boolean {
    return ['factorial', 'sqrt', 'sin', 'cos', 'tan', 'log'].includes(this.operation);
  }

  formatResult(result: number | string): string {
    if (typeof result === 'string') {
      return result;
    }
    if (!isFinite(result)) {
      return result.toString();
    }
    if (Math.abs(result) >= 1000000) {
      return Number(result).toExponential(6);
    }
    const rounded = Math.round(result * 1000000) / 1000000;
    if (Math.abs(rounded) >= 1000000) {
      return Number(rounded).toExponential(6);
    }
    return rounded.toLocaleString();
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getCalculationString(): string {
  const operations = {
    add: '+', subtract: '−', multiply: '×', divide: '÷',
    power: '^', factorial: '!', sqrt: '√', modulus: '%',
    sin: 'sin', cos: 'cos', tan: 'tan', log: 'ln'
  };

  if (this.result === null) {
    return '';
  }

  if (this.operation === 'factorial') {
    return `${this.a}! = ${this.formatResult(this.result)}`;
  } else if (['sqrt', 'sin', 'cos', 'tan', 'log'].includes(this.operation)) {
    return `${operations[this.operation as keyof typeof operations]}(${this.a}) = ${this.formatResult(this.result)}`;
  } else {
    return `${this.a} ${operations[this.operation as keyof typeof operations]} ${this.b} = ${this.formatResult(this.result)}`;
  }
}

  getOperationName(): string {
    return this.operationInfo[this.operation as keyof typeof this.operationInfo]?.name || 'Unknown';
  }

  getOperationDescription(): string {
    return this.operationInfo[this.operation as keyof typeof this.operationInfo]?.description || '';
  }
}