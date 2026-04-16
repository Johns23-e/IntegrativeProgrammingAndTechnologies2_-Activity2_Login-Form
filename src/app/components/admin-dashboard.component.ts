import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-page">
      <div class="dashboard-card">
        <div class="dashboard-badge">CampusAssist</div>
        <h1 class="dashboard-title">Welcome, {{ displayName }}!</h1>
        <p class="dashboard-lead">
          You're signed in to Integrative Programming and Technologies 2.
          Use the complaint monitoring tools from your dashboard when they're available.
        </p>
        <p class="dashboard-hint">
          Keep learning, stay curious, and enjoy the journey.
        </p>
        <button type="button" class="logout-btn" (click)="logout.emit()">Log out</button>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  @Input() displayName = '';
  @Output() logout = new EventEmitter<void>();
}
