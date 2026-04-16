import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type AuthView = 'auth' | 'dashboard';
type AuthMode = 'login' | 'register';
type LastAction = '' | 'login' | 'register';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  view: AuthView = 'auth';
  authMode: AuthMode = 'login';

  loggedInDisplayName = '';

  message = '';
  error = '';
  lastAction: LastAction = '';
  rememberMe = false;
  showLoginPassword = false;
  showRegisterPassword = false;
  showRegisterConfirmPassword = false;

  email = '';
  password = '';
  registerEmail = '';
  registerUserId = '';
  registerPassword = '';
  registerConfirmPassword = '';

  correctEmail = 'john.abina@evsu.edu.ph';
  correctPassword = '2023-00145';

  registeredUsers: { email: string; userId: string; password: string }[] = [];

  private readonly evsuEmailRegex = /^[a-zA-Z0-9._%+-]+@evsu\.edu\.ph$/i;
  private readonly strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  switchAuthMode(mode: AuthMode) {
    this.authMode = mode;
    this.message = '';
    this.error = '';
    this.lastAction = '';
  }

  onRegister() {
    this.lastAction = 'register';
    const e = this.registerEmail.trim().toLowerCase();
    const id = this.registerUserId.trim();
    const p = this.registerPassword;
    const c = this.registerConfirmPassword;

    if (!e || !id || !p || !c) {
      this.error = 'Please fill in all fields.';
      this.message = '';
      return;
    }
    if (!this.evsuEmailRegex.test(e)) {
      this.error = 'Email must be a valid EVSU email (example: name@evsu.edu.ph).';
      this.message = '';
      return;
    }
    if (!/^\d{4}-\d{5}$/.test(id)) {
      this.error = 'User ID must follow this format: 0000-00000.';
      this.message = '';
      return;
    }
    if (!this.strongPasswordRegex.test(p)) {
      this.error =
        'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.';
      this.message = '';
      return;
    }
    if (p !== c) {
      this.error = 'Passwords do not match.';
      this.message = '';
      return;
    }

    const exists = this.registeredUsers.some(
      (x) => x.email.toLowerCase() === e
    );
    if (exists) {
      this.error = 'An account with this email already exists.';
      this.message = '';
      return;
    }
    const idExists = this.registeredUsers.some((x) => x.userId === id);
    if (idExists) {
      this.error = 'This user ID is already registered.';
      this.message = '';
      return;
    }

    this.registeredUsers.push({ email: e, userId: id, password: p });
    this.message = 'Account created successfully. You can see it now in the table below.';
    this.error = '';
    this.registerEmail = '';
    this.registerUserId = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
    this.authMode = 'register';
  }

  onLogin() {
    this.lastAction = 'login';
    const e = this.email.trim().toLowerCase();
    const p = this.password.trim();

    if (!e || !p) {
      this.message = '';
      this.error = 'Please enter your email and password.';
      return;
    }
    if (!this.evsuEmailRegex.test(e)) {
      this.message = '';
      this.error = 'Please use your EVSU email format (name@evsu.edu.ph).';
      return;
    }

    const matchHardcoded =
      e === this.correctEmail &&
      p === this.correctPassword;

    const matchRegistered = this.registeredUsers.some(
      (x) =>
        x.email.toLowerCase() === e && x.password === p
    );

    if (matchHardcoded || matchRegistered) {
      this.error = '';
      this.message = '';
      if (matchHardcoded) {
        this.loggedInDisplayName = 'Abina, John Roque B.';
      } else {
        this.loggedInDisplayName = e;
      }
      this.view = 'dashboard';
    } else {
      this.message = '';
      this.error = 'Email or password does not match. Please try again.';
    }
  }

  logout() {
    this.view = 'auth';
    this.authMode = 'login';
    this.email = '';
    this.password = '';
    this.message = '';
    this.error = '';
    this.lastAction = '';
    this.loggedInDisplayName = '';
  }
}
