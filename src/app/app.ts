import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type AuthView = 'auth' | 'dashboard';
type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  view: AuthView = 'auth';
  authMode: AuthMode = 'login';

  username = '';
  password = '';

  registerUsername = '';
  registerUserId = '';
  registerPassword = '';
  registerConfirmPassword = '';
  rememberMe = false;
  showLoginPassword = false;
  showRegisterPassword = false;
  showRegisterConfirmPassword = false;

  loggedInDisplayName = '';

  message = '';
  error = '';

  correctUsername = 'JOHN ROQUE ABINA';
  correctPassword = '2023-00145';

  registeredUsers: { username: string; userId: string; password: string }[] = [];

  switchAuthMode(mode: AuthMode) {
    this.authMode = mode;
    this.message = '';
    this.error = '';
  }

  togglePassword(field: 'login' | 'register' | 'confirm') {
    if (field === 'login') {
      this.showLoginPassword = !this.showLoginPassword;
      return;
    }
    if (field === 'register') {
      this.showRegisterPassword = !this.showRegisterPassword;
      return;
    }
    this.showRegisterConfirmPassword = !this.showRegisterConfirmPassword;
  }

  onRegister() {
    const u = this.registerUsername.trim();
    const id = this.registerUserId.trim();
    const p = this.registerPassword;
    const c = this.registerConfirmPassword;

    if (!u || !id || !p || !c) {
      this.error = 'Please fill in all fields.';
      this.message = '';
      return;
    }
    if (!/^\d{4}-\d{5}$/.test(id)) {
      this.error = 'User ID must follow this format: 0000-00000.';
      this.message = '';
      return;
    }
    if (p !== c) {
      this.error = 'Passwords do not match.';
      this.message = '';
      return;
    }
    if (p.length < 4) {
      this.error = 'Password must be at least 4 characters.';
      this.message = '';
      return;
    }

    const exists = this.registeredUsers.some(
      (x) => x.username.toUpperCase() === u.toUpperCase()
    );
    if (exists) {
      this.error = 'An account with this username already exists.';
      this.message = '';
      return;
    }
    const idExists = this.registeredUsers.some((x) => x.userId === id);
    if (idExists) {
      this.error = 'This user ID is already registered.';
      this.message = '';
      return;
    }

    this.registeredUsers.push({ username: u, userId: id, password: p });
    this.message = 'Account created successfully. You can see it now in the table below.';
    this.error = '';
    this.registerUsername = '';
    this.registerUserId = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
    this.authMode = 'register';
  }

  onLogin() {
    const u = this.username.trim();
    const p = this.password.trim();

    const matchHardcoded =
      u.toUpperCase() === this.correctUsername &&
      p === this.correctPassword;

    const matchRegistered = this.registeredUsers.some(
      (x) =>
        x.username.toUpperCase() === u.toUpperCase() && x.password === p
    );

    if (matchHardcoded || matchRegistered) {
      this.error = '';
      this.message = '';
      if (matchHardcoded) {
        this.loggedInDisplayName = 'Abina, John Roque B.';
      } else {
        this.loggedInDisplayName = u;
      }
      this.view = 'dashboard';
    } else {
      this.message = '';
      this.error = 'Invalid username or password. Please try again.';
    }
  }

  logout() {
    this.view = 'auth';
    this.authMode = 'login';
    this.username = '';
    this.password = '';
    this.message = '';
    this.error = '';
    this.loggedInDisplayName = '';
  }
}
