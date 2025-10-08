import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    template: `
    <div class="dashboard">
      <h1>Lab Results Dashboard</h1>
      <p>Welcome to the Lab Results Management System</p>
    </div>
  `,
    styles: [`
    .dashboard {
      padding: 20px;
    }
  `]
})
export class DashboardComponent {
}
