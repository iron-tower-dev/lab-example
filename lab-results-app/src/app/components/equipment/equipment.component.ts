import { Component } from '@angular/core';

@Component({
    selector: 'app-equipment',
    standalone: true,
    template: `
    <div class="equipment">
      <h1>Equipment Management</h1>
      <p>Manage laboratory equipment</p>
    </div>
  `,
    styles: [`
    .equipment {
      padding: 20px;
    }
  `]
})
export class EquipmentComponent {
}
