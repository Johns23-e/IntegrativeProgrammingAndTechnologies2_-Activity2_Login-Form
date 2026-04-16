import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Create account</h2>
    <p class="form-subtitle">Create your account to start using CampusAssist.</p>

    <div class="field-group">
      <label for="register-email">EVSU Email</label>
      <input
        id="register-email"
        type="email"
        placeholder="name@evsu.edu.ph"
        [(ngModel)]="registerEmail"
      />
      <small class="hint-text">Only EVSU emails are allowed.</small>
    </div>

    <div class="field-group">
      <label for="register-user-id">User ID</label>
      <input
        id="register-user-id"
        type="text"
        placeholder="0000-00000"
        [(ngModel)]="registerUserId"
      />
      <small class="hint-text">Format: 0000-00000</small>
    </div>

    <div class="field-group">
      <label for="register-password">Password</label>
      <div class="password-row">
        <input
          id="register-password"
          [type]="showRegisterPassword ? 'text' : 'password'"
          placeholder="Create a password"
          [(ngModel)]="registerPassword"
        />
        <button
          type="button"
          class="toggle-password-btn"
          (click)="showRegisterPassword = !showRegisterPassword"
        >
          {{ showRegisterPassword ? 'Hide' : 'Show' }}
        </button>
      </div>
    </div>

    <div class="field-group">
      <label for="confirm-password">Confirm password</label>
      <div class="password-row">
        <input
          id="confirm-password"
          [type]="showConfirmPassword ? 'text' : 'password'"
          placeholder="Retype your password"
          [(ngModel)]="registerConfirmPassword"
        />
        <button
          type="button"
          class="toggle-password-btn"
          (click)="showConfirmPassword = !showConfirmPassword"
        >
          {{ showConfirmPassword ? 'Hide' : 'Show' }}
        </button>
      </div>
      <small class="hint-text">At least 8 chars with uppercase, lowercase, number, and symbol.</small>
    </div>

    <button
      type="button"
      class="login-btn register-submit"
      (click)="submitRegister()"
      [disabled]="!registerEmail.trim() || !registerUserId.trim() || !registerPassword || !registerConfirmPassword"
    >
      Register
    </button>
    <p class="success form-feedback" *ngIf="successMessage">{{ successMessage }}</p>
    <p class="error form-feedback" *ngIf="errorMessage">{{ errorMessage }}</p>

    <p class="switch-auth">
      Already have an account?
      <a href="#" (click)="$event.preventDefault(); switchToLogin.emit()">Login</a>
    </p>
  `
})
export class RegisterFormComponent {
  @Input() successMessage = '';
  @Input() errorMessage = '';
  @Output() registerSubmit = new EventEmitter<{
    email: string;
    userId: string;
    password: string;
    confirmPassword: string;
  }>();
  @Output() switchToLogin = new EventEmitter<void>();

  registerEmail = '';
  registerUserId = '';
  registerPassword = '';
  registerConfirmPassword = '';
  showRegisterPassword = false;
  showConfirmPassword = false;

  submitRegister() {
    this.registerSubmit.emit({
      email: this.registerEmail,
      userId: this.registerUserId,
      password: this.registerPassword,
      confirmPassword: this.registerConfirmPassword
    });
  }
}
