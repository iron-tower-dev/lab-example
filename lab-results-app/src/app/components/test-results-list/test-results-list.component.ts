import { Component } from '@angular/core';

@Component({
    selector: 'app-test-results-list',
    standalone: true,
    template: `
    <div class="test-results-list">
      <h1>Test Results List</h1>
      <p>List of all test results</p>
    </div>
  `,
    styles: [`
    .test-results-list {
      padding: 20px;
    }
  `]
})
export class TestResultsListComponent {
}
