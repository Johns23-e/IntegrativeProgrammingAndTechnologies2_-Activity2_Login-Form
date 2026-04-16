import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type AuthView = 'auth' | 'dashboard';
type AuthMode = 'login' | 'register';
type LastAction = '' | 'login' | 'register';
type RegisterMode = 'create' | 'edit';

interface UserRecord {
  email: string;
  userId: string;
  password: string;
}

interface RegisterInput {
  email: string;
  userId: string;
  password: string;
  confirmPassword: string;
}

interface IUserRepository {
  getAll(): UserRecord[];
  create(user: UserRecord): void;
  update(originalUserId: string, user: UserRecord): boolean;
  delete(userId: string): boolean;
  findByEmail(email: string): UserRecord | undefined;
  findByUserId(userId: string): UserRecord | undefined;
}

class InMemoryUserRepository implements IUserRepository {
  private users: UserRecord[] = [];

  getAll(): UserRecord[] {
    return [...this.users];
  }

  create(user: UserRecord): void {
    this.users.push(user);
  }

  update(originalUserId: string, user: UserRecord): boolean {
    const index = this.users.findIndex((x) => x.userId === originalUserId);
    if (index < 0) {
      return false;
    }
    this.users[index] = user;
    return true;
  }

  delete(userId: string): boolean {
    const index = this.users.findIndex((x) => x.userId === userId);
    if (index < 0) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }

  findByEmail(email: string): UserRecord | undefined {
    return this.users.find((x) => x.email === email);
  }

  findByUserId(userId: string): UserRecord | undefined {
    return this.users.find((x) => x.userId === userId);
  }
}

abstract class BaseValidator<T> {
  abstract validate(input: T): string | null;
}

class EvsuRegistrationValidator extends BaseValidator<RegisterInput> {
  private readonly evsuEmailRegex = /^[a-zA-Z0-9._%+-]+@evsu\.edu\.ph$/i;
  private readonly strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  validate(input: RegisterInput): string | null {
    if (!input.email || !input.userId || !input.password || !input.confirmPassword) {
      return 'Please fill in all fields.';
    }
    if (!this.evsuEmailRegex.test(input.email)) {
      return 'Email must be a valid EVSU email (example: name@evsu.edu.ph).';
    }
    if (!/^\d{4}-\d{5}$/.test(input.userId)) {
      return 'User ID must follow this format: 0000-00000.';
    }
    if (!this.strongPasswordRegex.test(input.password)) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.';
    }
    if (input.password !== input.confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  }
}

class UserManagementService {
  constructor(
    private readonly repository: IUserRepository,
    private readonly validator: BaseValidator<RegisterInput>
  ) {}

  getUsers(): UserRecord[] {
    return this.repository.getAll();
  }

  register(input: RegisterInput): string | null {
    const validationError = this.validator.validate(input);
    if (validationError) {
      return validationError;
    }

    if (this.repository.findByEmail(input.email)) {
      return 'An account with this email already exists.';
    }
    if (this.repository.findByUserId(input.userId)) {
      return 'This user ID is already registered.';
    }

    this.repository.create({
      email: input.email,
      userId: input.userId,
      password: input.password
    });
    return null;
  }

  update(originalUserId: string, input: RegisterInput): string | null {
    const validationError = this.validator.validate(input);
    if (validationError) {
      return validationError;
    }

    const emailOwner = this.repository.findByEmail(input.email);
    if (emailOwner && emailOwner.userId !== originalUserId) {
      return 'An account with this email already exists.';
    }

    const userIdOwner = this.repository.findByUserId(input.userId);
    if (userIdOwner && userIdOwner.userId !== originalUserId) {
      return 'This user ID is already registered.';
    }

    const updated = this.repository.update(originalUserId, {
      email: input.email,
      userId: input.userId,
      password: input.password
    });
    if (!updated) {
      return 'Selected user was not found.';
    }
    return null;
  }

  delete(userId: string): string | null {
    return this.repository.delete(userId) ? null : 'Selected user was not found.';
  }
}

class AuthService {
  private readonly evsuEmailRegex = /^[a-zA-Z0-9._%+-]+@evsu\.edu\.ph$/i;

  constructor(
    private readonly repository: IUserRepository,
    private readonly adminEmail: string,
    private readonly adminPassword: string
  ) {}

  login(email: string, password: string): { ok: boolean; displayName?: string; error?: string } {
    if (!email || !password) {
      return { ok: false, error: 'Please enter your email and password.' };
    }
    if (!this.evsuEmailRegex.test(email)) {
      return { ok: false, error: 'Please use your EVSU email format (name@evsu.edu.ph).' };
    }

    const isAdmin = email === this.adminEmail && password === this.adminPassword;
    if (isAdmin) {
      return { ok: true, displayName: 'Abina, John Roque B.' };
    }

    const isRegistered = this.repository.getAll().some(
      (x) => x.email === email && x.password === password
    );

    if (!isRegistered) {
      return { ok: false, error: 'Email or password does not match. Please try again.' };
    }
    return { ok: true, displayName: email };
  }
}

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
  registerMode: RegisterMode = 'create';
  editingOriginalUserId = '';
  rememberMe = false;
  showLoginPassword = false;
  showRegisterPassword = false;
  showRegisterConfirmPassword = false;
  searchTerm = '';
  activeSearchTerm = '';

  email = '';
  password = '';
  registerEmail = '';
  registerUserId = '';
  registerPassword = '';
  registerConfirmPassword = '';

  correctEmail = 'john.abina@evsu.edu.ph';
  correctPassword = '2023-00145';
  private readonly repository = new InMemoryUserRepository();
  private readonly validator = new EvsuRegistrationValidator();
  private readonly userService = new UserManagementService(this.repository, this.validator);
  private readonly authService = new AuthService(
    this.repository,
    this.correctEmail,
    this.correctPassword
  );

  get registeredUsers(): UserRecord[] {
    return this.userService.getUsers();
  }

  get filteredUsers(): UserRecord[] {
    const term = this.activeSearchTerm.trim().toLowerCase();
    if (!term) {
      return this.registeredUsers;
    }
    return this.registeredUsers.filter(
      (x) => x.email.includes(term) || x.userId.includes(term)
    );
  }

  applySearch() {
    this.activeSearchTerm = this.searchTerm;
  }

  clearSearch() {
    this.searchTerm = '';
    this.activeSearchTerm = '';
  }

  switchAuthMode(mode: AuthMode) {
    this.authMode = mode;
    this.message = '';
    this.error = '';
    this.lastAction = '';
    this.searchTerm = '';
    this.activeSearchTerm = '';
    this.cancelEdit();
  }

  onRegister() {
    this.lastAction = 'register';
    const e = this.registerEmail.trim().toLowerCase();
    const id = this.registerUserId.trim();
    const p = this.registerPassword;
    const c = this.registerConfirmPassword;

    const input: RegisterInput = {
      email: e,
      userId: id,
      password: p,
      confirmPassword: c
    };

    const error =
      this.registerMode === 'create'
        ? this.userService.register(input)
        : this.userService.update(this.editingOriginalUserId, input);

    if (error) {
      this.error = error;
      this.message = '';
      return;
    }

    this.error = '';
    this.message =
      this.registerMode === 'create'
        ? 'Account created successfully. You can see it now in the table below.'
        : 'User updated successfully.';
    this.clearRegisterFields();
    this.registerMode = 'create';
    this.editingOriginalUserId = '';
  }

  onLogin() {
    this.lastAction = 'login';
    const e = this.email.trim().toLowerCase();
    const p = this.password.trim();
    const result = this.authService.login(e, p);
    if (!result.ok) {
      this.message = '';
      this.error = result.error || 'Login failed.';
      return;
    }

    this.error = '';
    this.message = '';
    this.loggedInDisplayName = result.displayName || e;
    this.view = 'dashboard';
  }

  startEdit(user: UserRecord) {
    this.registerMode = 'edit';
    this.editingOriginalUserId = user.userId;
    this.registerEmail = user.email;
    this.registerUserId = user.userId;
    this.registerPassword = user.password;
    this.registerConfirmPassword = user.password;
    this.lastAction = 'register';
    this.message = '';
    this.error = '';
  }

  deleteUser(userId: string) {
    this.lastAction = 'register';
    const error = this.userService.delete(userId);
    if (error) {
      this.error = error;
      this.message = '';
      return;
    }
    if (this.registerMode === 'edit' && this.editingOriginalUserId === userId) {
      this.cancelEdit();
    }
    this.error = '';
    this.message = 'User deleted successfully.';
  }

  cancelEdit() {
    this.registerMode = 'create';
    this.editingOriginalUserId = '';
    this.clearRegisterFields();
  }

  private clearRegisterFields() {
    this.registerEmail = '';
    this.registerUserId = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
  }

  logout() {
    this.view = 'auth';
    this.authMode = 'login';
    this.email = '';
    this.password = '';
    this.message = '';
    this.error = '';
    this.lastAction = '';
    this.searchTerm = '';
    this.activeSearchTerm = '';
    this.cancelEdit();
    this.loggedInDisplayName = '';
  }
}
