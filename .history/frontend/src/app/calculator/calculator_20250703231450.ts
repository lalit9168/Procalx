// calculator.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface CalculationResponse {
  result: number;
}

interface CalculationError {
  error: {
    error: string;
  };
}

interface CalculationHistory {
  id: number;
  expression: string;
  result: number;
  timestamp: Date;
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="calculator-container">
      <!-- Animated Background -->
      <div class="animated-background">
        <div class="particle" *ngFor="let particle of particles" 
             [style.left.px]="particle.x"
             [style.top.px]="particle.y"
             [style.animation-delay.s]="particle.delay">
        </div>
      </div>

      <!-- Main Calculator Card -->
      <div class="calculator-card">
        <!-- Header Section -->
        <div class="header">
          <div class="header-content">
            <div class="icon-container">
              <div class="calculator-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
              </div>
              <div class="theme-toggle" (click)="toggleTheme()">
                <span class="theme-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
              </div>
            </div>
            <h1 class="title">Advanced Calculator</h1>
            <p class="subtitle">Professional mathematical computations</p>
          </div>
        </div>

        <!-- Main Content -->
        <div class="calculator-body">
          <!-- Display Section -->
          <div class="display-section">
            <div class="display-primary">
              <span class="display-value">{{ displayValue }}</span>
            </div>
            <div class="display-secondary" *ngIf="lastCalculation">
              <span class="last-calc">{{ lastCalculation }}</span>
            </div>
          </div>

          <!-- Input Form -->
          <form (submit)="calculate($event)" class="calculator-form">
            <div class="inputs-grid">
              <!-- First Number Input -->
              <div class="input-group">
                <label for="firstNumber" class="input-label">
                  <span class="label-text">
                    <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z"></path>
                    </svg>
                    First Number
                  </span>
                  <span class="label-badge">A</span>
                </label>
                <div class="input-wrapper">
                  <input 
                    id="firstNumber"
                    type="number" 
                    [(ngModel)]="a" 
                    name="a" 
                    placeholder="Enter first number" 
                    required
                    step="any"
                    class="number-input"
                    (input)="updateDisplay()"
                    [class.error]="error && error.includes('first')"
                  >
                  <div class="input-glow"></div>
                </div>
              </div>

              <!-- Operation Selection -->
              <div class="operation-group">
                <label for="operation" class="input-label">
                  <span class="label-text">
                    <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Operation
                  </span>
                  <span class="label-badge">OP</span>
                </label>
                <div class="select-wrapper">
                  <select 
                    id="operation"
                    [(ngModel)]="operation" 
                    name="operation"
                    class="operation-select"
                    (change)="onOperationChange()"
                  >
                    <option value="add">➕ Addition</option>
                    <option value="subtract">➖ Subtraction</option>
                    <option value="multiply">✖️ Multiplication</option>
                    <option value="divide">➗ Division</option>
                    <option value="power">🔺 Power</option>
                    <option value="factorial">❗ Factorial (A only)</option>
                    <option value="sqrt">√ Square Root (A only)</option>
                    <option value="modulus">% Modulus</option>
                  
                  </select>
                  <div class="select-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Second Number Input -->
              <div class="input-group" [class.disabled]="isSingleArgOperation()">
                <label for="secondNumber" class="input-label">
                  <span class="label-text">
                    <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z"></path>
                    </svg>
                    Second Number
                  </span>
                  <span class="label-badge" [class.optional]="isSingleArgOperation()">
                    {{ isSingleArgOperation() ? 'N/A' : 'B' }}
                  </span>
                </label>
                <div class="input-wrapper">
                  <input 
                    id="secondNumber"
                    type="number" 
                    [(ngModel)]="b" 
                    name="b" 
                    placeholder="Enter second number" 
                    step="any"
                    class="number-input"
                    (input)="updateDisplay()"
                    [disabled]="isSingleArgOperation()"
                    [class.error]="error && error.includes('second')"
                  >
                  <div class="input-glow"></div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button 
                type="button" 
                class="action-btn secondary"
                (click)="clearAll()"
                [disabled]="isLoading"
              >
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                <span>Clear</span>
              </button>

              <button 
                type="submit" 
                class="action-btn primary"
                [disabled]="isLoading"
                [class.loading]="isLoading"
              >
                <span *ngIf="!isLoading" class="btn-content">
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"></polygon>
                  </svg>
                  <span>Calculate</span>
                </span>
                <span *ngIf="isLoading" class="loading-content">
                  <div class="loading-spinner"></div>
                  <span>Computing...</span>
                </span>
              </button>
            </div>
          </form>

          <!-- Result Section -->
          <!-- Result Section -->
<div class="result-section" *ngIf="result !== null || error">
  <div *ngIf="result !== null && !error" class="result-card success">
    <div class="result-header">
      <div class="result-icon-wrapper">
        <svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22,4 12,14.01 9,11.01"></polyline>
        </svg>
      </div>
      <div class="result-info">
        <h3 class="result-title">Result</h3>
        <p class="result-subtitle">{{ getCalculationString() }}</p>
      </div>
    </div>
    <div class="result-value-container">
      <div class="result-value">{{ formatResult(result) }}</div>
    </div>
    <button class="copy-btn" (click)="copyResult()" title="Copy result">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    </button>
  </div>

  <div *ngIf="error" class="result-card error">
    <div class="result-header">
      <div class="result-icon-wrapper">
        <svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      <div class="result-info">
        <h3 class="result-title">Error</h3>
        <p class="result-subtitle">Something went wrong</p>
      </div>
    </div>
    <div class="error-message">{{ error }}</div>
  </div>
</div>

        <!-- History Section -->
        <div class="history-section" *ngIf="history.length > 0">
          <div class="history-header">
            <h3 class="history-title">
              <svg class="history-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
              Recent Calculations
            </h3>
            <button class="clear-history-btn" (click)="clearHistory()" title="Clear history">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6M8,6V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
              </svg>
            </button>
          </div>
          <div class="history-list">
            <div class="history-item" *ngFor="let item of history.slice(-5)" (click)="useHistoryItem(item)">
              <div class="history-content">
                <div class="history-expression">{{ item.expression }}</div>
                <div class="history-result">{{ formatResult(item.result) }}</div>
              </div>
              <div class="history-time">{{ formatTime(item.timestamp) }}</div>
            </div>
          </div>
        </div>

        <!-- Operation Info -->
        <div class="operation-info">
          <div class="info-card">
            <div class="info-header">
              <div class="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9,9h6v6H9z"></path>
                </svg>
              </div>
              <div class="info-content">
                <h4 class="info-title">{{ getOperationName() }}</h4>
                <p class="info-description">{{ getOperationDescription() }}</p>
              </div>
            </div>
            <div class="info-stats">
              <div class="stat">
                <span class="stat-label">Calculations Today</span>
                <span class="stat-value">{{ history.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-color:rgb(142, 197, 238);
      --secondary-color: #764ba2;
      --accent-color: #f093fb;
      --success-color: #10b981;
      --error-color: #ef4444;
      --warning-color: #f59e0b;
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --border-color: #e5e7eb;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    :host(.dark) {
      --text-primary: #f9fafb;
      --text-secondary: #d1d5db;
      --bg-primary: #1f2937;
      --bg-secondary: #111827;
      --border-color: #374151;
    }

    * {
      box-sizing: border-box;
    }

    .calculator-container {
      min-height: 100vh;
      background: linear-gradient(135deg,rgb(242, 242, 242) 0%,rgb(230, 229, 231) 50%,rgb(241, 239, 241) 100%);
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
      overflow: hidden;
    }

    .animated-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      animation: float 8s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) translateX(0px) rotate(0deg);
        opacity: 0.6;
      }
      25% { 
        transform: translateY(-20px) translateX(10px) rotate(90deg);
        opacity: 1;
      }
      50% { 
        transform: translateY(-40px) translateX(-10px) rotate(180deg);
        opacity: 0.8;
      }
      75% { 
        transform: translateY(-20px) translateX(15px) rotate(270deg);
        opacity: 0.4;
      }
    }

    .calculator-card {
      background: var(--bg-primary);
      border-radius: 32px;
      box-shadow: 
        0 32px 64px rgba(0, 0, 0, 0.12),
        0 16px 32px rgba(0, 0, 0, 0.08),
        0 8px 16px rgba(0, 0, 0, 0.04),
        0 0 0 1px rgba(255, 255, 255, 0.05);
      max-width: 520px;
      width: 100%;
      overflow: hidden;
      position: relative;
      z-index: 1;
      animation: slideInScale 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(20px);
    }

    @keyframes slideInScale {
      0% {
        opacity: 0;
        transform: translateY(60px) scale(0.8);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      padding: 48px 40px;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
      animation: shimmer 4s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%) skewX(-15deg); }
      100% { transform: translateX(200%) skewX(-15deg); }
    }

    .header-content {
      position: relative;
      z-index: 1;
      text-align: center;
    }

    .icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      margin-bottom: 24px;
    }

    .calculator-icon {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      animation: pulse 2s ease-in-out infinite;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .calculator-icon svg {
      width: 32px;
      height: 32px;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .theme-toggle {
      position: absolute;
      top: -20px;
      right: -20px;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .theme-toggle:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.1);
    }

    .theme-icon {
      font-size: 20px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .title {
      margin: 0 0 12px 0;
      font-size: 36px;
      font-weight: 800;
      color: white;
      letter-spacing: -1px;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .subtitle {
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .calculator-body {
      padding: 48px 40px;
    }

    .display-section {
      background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(102, 126, 234, 0.05) 100%);
      border-radius: 24px;
      padding: 32px;
      margin-bottom: 40px;
      border: 1px solid var(--border-color);
      position: relative;
      overflow: hidden;
    }

    .display-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.5), transparent);
    }

    .display-primary {
      text-align: right;
      margin-bottom: 8px;
    }

    .display-value {
      font-size: 48px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -1px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .display-secondary {
      text-align: right;
      opacity: 0.7;
    }

    .last-calc {
      font-size: 16px;
      color: var(--text-secondary);
      font-style: italic;
    }

    .inputs-grid {
      display: grid;
      gap: 32px;
      margin-bottom: 40px;
    }

    .input-group, .operation-group {
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .input-group.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .input-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      color: var(--text-primary);
      font-weight: 600;
      font-size: 16px;
    }

    .label-text {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .label-icon {
      width: 20px;
      height: 20px;
      color: var(--primary-color);
    }

    .label-badge {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      min-width: 32px;
      text-align: center;
      box-shadow: var(--shadow-sm);
    }

    .label-badge.optional {
      background: linear-gradient(135deg, var(--text-secondary), #9ca3af);
    }

    .input-wrapper, .select-wrapper {
      position: relative;
    }

    .number-input, .operation-select {
      width: 100%;
      padding: 20px 24px;
      border: 2px solid var(--border-color);
      border-radius: 20px;
      font-size: 18px;
      font-weight: 500;
      background: var(--bg-secondary);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: var(--text-primary);
      box-shadow: var(--shadow-sm);
    }

    .number-input::placeholder {
      color: var(--text-secondary);
      font-weight: 400;
    }

    .number-input:focus, .operation-select:focus {
      outline: none;
      border-color: var(--primary-color);
      background: var(--bg-primary);
      box-shadow: 0 0 0 6px rgba(102, 126, 234, 0.1), var(--shadow-lg);
      transform: translateY(-2px);
    }

    .number-input:disabled {
      background: #f3f4f6;
      color: var(--text-secondary);
      cursor: not-allowed;
    }

    .number-input.error {
      border-color: var(--error-color);
      background: #fef2f2;
      box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.1);
    }

    .operation-select {
      appearance: none;
      cursor: pointer;
      padding-right: 56px;
    }

    .select-arrow {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: var(--text-secondary);
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .operation-select:focus + .select-arrow {
      color: var(--primary-color);
      transform: translateY(-50%) rotate(180deg);
    }

    .input-glow {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      transform: scaleX(0);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 1px;
    }

    .number-input:focus + .input-glow {
      transform: scaleX(1);
    }

    .action-buttons {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 16px;
      margin-bottom: 40px;
    }

    .action-btn {
      padding: 18px 24px;
      border: none;
      border-radius: 20px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      position: relative;
      overflow: hidden;
    }

    .action-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .action-btn:hover::before {
      left: 100%;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      color: white;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
    }

    .action-btn.primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
    }

    .action-btn.secondary {
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
    }

    .action-btn.secondary:hover:not(:disabled) {
      background: var(--bg-primary);
      border-color: var(--primary-color);
      transform: translateY(-1px);
    }

    .action-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-icon {
      width: 20px;
      height: 20px;
    }

    .loading-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .result-section {
      margin-bottom: 40px;
    }

    .result-card {
      padding: 32px;
      border-radius: 24px;
      position: relative;
      overflow: hidden;
      animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-lg);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .result-card.success {
      background: linear-gradient(135deg, #f0fdf4, #dcfce7);
      border: 1px solid #bbf7d0;
      color: #166534;
    }

    .result-card.error {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      border: 1px solid #fecaca;
      color: #dc2626;
    }

    .result-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--success-color), #34d399);
    }

    .result-card.error::before {
      background: linear-gradient(90deg, var(--error-color), #f87171);
    }

    .result-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .result-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--success-color);
      color: white;
      box-shadow: var(--shadow-md);
    }

    .result-card.error .result-icon-wrapper {
      background: var(--error-color);
    }

    .result-icon {
      width: 24px;
      height: 24px;
    }

    .result-info {
      flex: 1;
    }

    .result-title {
      margin: 0 0 4px 0;
      font-size: 20px;
      font-weight: 700;
    }

    .result-subtitle {
      margin: 0;
      font-size: 14px;
      opacity: 0.8;
      font-weight: 500;
    }

    .result-value-container {
      position: relative;
      padding-right: 60px;
    }

    .result-value {
      font-size: 42px;
      font-weight: 800;
      margin-bottom: 12px;
      word-break: break-all;
      line-height: 1.1;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .calculation-expression {
      font-size: 16px;
      opacity: 0.8;
      font-style: italic;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.5);
      padding: 8px 16px;
      border-radius: 12px;
      display: inline-block;
    }

    .copy-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.8);
      color: var(--success-color);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
    }

    .copy-btn:hover {
      background: white;
      transform: scale(1.1);
      box-shadow: var(--shadow-md);
    }

    .copy-btn svg {
      width: 16px;
      height: 16px;
    }

    .error-message {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.5;
      background: rgba(255, 255, 255, 0.7);
      padding: 16px;
      border-radius: 12px;
      border-left: 4px solid var(--error-color);
    }

    .history-section {
      margin-bottom: 40px;
    }

    .history-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .history-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .history-icon {
      width: 20px;
      height: 20px;
      color: var(--primary-color);
    }

    .clear-history-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 10px;
      background: var(--bg-secondary);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-color);
    }

    .clear-history-btn:hover {
      background: var(--error-color);
      color: white;
      transform: scale(1.1);
    }

    .clear-history-btn svg {
      width: 16px;
      height: 16px;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .history-item {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 16px 20px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .history-item:hover {
      background: var(--bg-primary);
      border-color: var(--primary-color);
      transform: translateX(4px);
      box-shadow: var(--shadow-md);
    }

    .history-content {
      flex: 1;
    }

    .history-expression {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }

    .history-result {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .history-time {
      font-size: 12px;
      color: var(--text-secondary);
      opacity: 0.7;
    }

    .operation-info {
      background: var(--bg-secondary);
      border-radius: 24px;
      padding: 32px;
      border: 1px solid var(--border-color);
    }

    .info-card {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .info-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: var(--shadow-md);
    }

    .info-icon svg {
      width: 24px;
      height: 24px;
      color: white;
    }

    .info-content {
      flex: 1;
    }

    .info-title {
      margin: 0 0 8px 0;
      color: var(--text-primary);
      font-size: 20px;
      font-weight: 700;
    }

    .info-description {
      margin: 0;
      color: var(--text-secondary);
      font-size: 14px;
      line-height: 1.6;
    }

    .info-stats {
      display: flex;
      gap: 20px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      background: var(--bg-primary);
      border-radius: 16px;
      border: 1px solid var(--border-color);
      flex: 1;
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-secondary);
      margin-bottom: 4px;
      font-weight: 500;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-color);
    }

    @media (max-width: 640px) {
      .calculator-container {
        padding: 16px;
      }
      
      .calculator-card {
        max-width: none;
        border-radius: 24px;
      }
      
      .header {
        padding: 36px 24px;
      }
      
      .title {
        font-size: 28px;
      }
      
      .subtitle {
        font-size: 16px;
      }
      
      .calculator-body {
        padding: 36px 24px;
      }
      
      .display-section {
        padding: 24px;
      }
      
      .display-value {
        font-size: 36px;
      }
      
      .inputs-grid {
        gap: 24px;
      }
      
      .action-buttons {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      
      .result-value {
        font-size: 32px;
      }
      
      .operation-info {
        padding: 24px;
      }
      
      .info-header {
        flex-direction: column;
        text-align: center;
      }
      
      .info-stats {
        justify-content: center;
      }
    }
  `]
})
export class CalculatorComponent {
  a: number = 0;
  b: number = 0;
  operation: string = 'add';
  result: number | null = null;
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
          this.result = res.result;
          this.error = '';
          this.isLoading = false;
          this.updateDisplay();
          this.lastCalculation = this.getCalculationString();
          this.addToHistory();
        },
        error: (err) => {
          this.result = null;
          this.error = err.error?.error || 'Server error occurred. Please try again.';
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

 formatResult(result: number): string {
  // Handle special cases
  if (!isFinite(result)) {
    return result.toString();
  }
  
  if (Math.abs(result) >= 1000000) {
    return result.toExponential(6);
  }
  
  // For smaller numbers, round to avoid floating point precision issues
  const rounded = Math.round(result * 1000000) / 1000000;
  
  // If the rounded number is still very large, use exponential notation
  if (Math.abs(rounded) >= 1000000) {
    return rounded.toExponential(6);
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

// No changes needed. The calculation logic should remain in the backend.