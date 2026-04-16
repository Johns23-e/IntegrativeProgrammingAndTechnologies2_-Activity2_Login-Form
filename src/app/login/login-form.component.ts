import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Login</h2>
    <p class="form-subtitle">Sign in with your EVSU email and password.</p>

    <div class="field-group">
      <label for="login-email">EVSU Email</label>
      <input
        id="login-email"
        type="email"
        placeholder="name@evsu.edu.ph"
        [(ngModel)]="email"
      />
    </div>

    <div class="field-group">
      <label for="login-password">Password</label>
      <div class="password-row">
        <input
          id="login-password"
          [type]="showPassword ? 'text' : 'password'"
          placeholder="Enter your password"
          [(ngModel)]="password"
        />
        <button
          type="button"
          class="toggle-password-btn"
          (click)="showPassword = !showPassword"
        >
          {{ showPassword ? 'Hide' : 'Show' }}
        </button>
      </div>
    </div>

    <div class="options">
      <label><input type="checkbox" [(ngModel)]="rememberMe" /> Remember me</label>
      <a href="#">Forgot password?</a>
    </div>

    <button
      type="button"
      class="login-btn"
      (click)="submitLogin()"
      [disabled]="!email.trim() || !password.trim()"
    >
      Login
    </button>
    <p class="error form-feedback" *ngIf="errorMessage">{{ errorMessage }}</p>

    <p class="switch-auth">
      Don't have an account?
      <a href="#" (click)="$event.preventDefault(); switchToRegister.emit()">Register</a>
    </p>
  `
})
export class LoginFormComponent {
  @Input() errorMessage = '';
  @Output() loginSubmit = new EventEmitter<{ email: string; password: string; rememberMe: boolean }>();
  @Output() switchToRegister = new EventEmitter<void>();

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;

  submitLogin() {
    this.loginSubmit.emit({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    });
  }
}
