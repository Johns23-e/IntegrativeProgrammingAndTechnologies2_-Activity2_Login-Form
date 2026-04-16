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
  registerPassword = '';
  registerConfirmPassword = '';

  loggedInDisplayName = '';

  message = '';
  error = '';

  correctUsername = 'JOHN ROQUE ABINA';
  correctPassword = '2023-00145';

  private registeredUsers: { username: string; password: string }[] = [];

  switchAuthMode(mode: AuthMode) {
    this.authMode = mode;
    this.message = '';
    this.error = '';
  }

  onRegister() {
    const u = this.registerUsername.trim();
    const p = this.registerPassword;
    const c = this.registerConfirmPassword;

    if (!u || !p || !c) {
      this.error = 'Please fill in all fields.';
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

    this.registeredUsers.push({ username: u, password: p });
    this.message = 'Account created! You can now log in.';
    this.error = '';
    this.registerUsername = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
    this.authMode = 'login';
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
