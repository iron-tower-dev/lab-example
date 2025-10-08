import { Component } from '@angular/core';

@Component({
    selector: 'app-samples',
    standalone: true,
    template: `
    <div class="samples">
      <h1>Samples Management</h1>
      <p>Manage laboratory samples</p>
    </div>
  `,
    styles: [`
    .samples {
      padding: 20px;
    }
  `]
})
export class SamplesComponent {
}
