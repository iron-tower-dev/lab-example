import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule
    ],
    template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
                   [attr.role]="'navigation'"
                   [mode]="'side'"
                   [opened]="true">
        <mat-toolbar>Lab Results System</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/test-results" routerLinkActive="active">
            <mat-icon matListItemIcon>science</mat-icon>
            <span matListItemTitle>Test Results</span>
          </a>
          <a mat-list-item routerLink="/samples" routerLinkActive="active">
            <mat-icon matListItemIcon>inventory</mat-icon>
            <span matListItemTitle>Samples</span>
          </a>
          <a mat-list-item routerLink="/equipment" routerLinkActive="active">
            <mat-icon matListItemIcon>precision_manufacturing</mat-icon>
            <span matListItemTitle>Equipment</span>
          </a>
          <a mat-list-item routerLink="/reports" routerLinkActive="active">
            <mat-icon matListItemIcon>assessment</mat-icon>
            <span matListItemTitle>Reports</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="drawer.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>Laboratory Results Management System</span>
          <span class="spacer"></span>
          <button mat-icon-button>
            <mat-icon>account_circle</mat-icon>
          </button>
        </mat-toolbar>
        
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
    styles: [`
    .sidenav-container {
      height: 100vh;
    }
    
    .sidenav {
      width: 250px;
    }
    
    .sidenav .mat-toolbar {
      background: inherit;
    }
    
    .mat-toolbar.mat-primary {
      position: sticky;
      top: 0;
      z-index: 1;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .content {
      padding: 20px;
    }
    
    .active {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class AppComponent {
    title = 'Lab Results App';
}
