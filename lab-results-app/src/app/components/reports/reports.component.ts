import { Component } from '@angular/core';

@Component({
    selector: 'app-reports',
    standalone: true,
    template: `
    <div class="reports">
      <h1>Reports</h1>
      <p>Generate and view laboratory reports</p>
    </div>
  `,
    styles: [`
    .reports {
      padding: 20px;
    }
  `]
})
export class ReportsComponent {
}
